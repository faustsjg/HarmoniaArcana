// FILE: assets/js/director.js
import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
    apiKey: null,
    inspiracioMestra: "",
    contextActual: { mood: 'inici' },
    bibliotecaSessio: {},
    intervalId: null,
    isSessionActive: false,
    isProcessing: false,
    fullTranscript: "",

    async init(apiKey, inspiracio) {
        if (this.isSessionActive) return;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio.trim() || "Música èpica d'aventures de fantasia";
        this.isSessionActive = true;
        this.fullTranscript = "";
        
        UI.showScreen('session-screen');
        UI.updateTranscript("");
        UI.updateMusicStatus(false);
        
        const speechSupported = Speech.init((text) => {
            this.fullTranscript += text + " ";
            UI.updateTranscript(this.fullTranscript);
        });
        
        if (!speechSupported) {
            UI.updateStatus("Error: El reconeixement de veu no és compatible.");
            return;
        }

        await this.generarMusicaInicial();
    },

    async generarMusicaInicial() {
        UI.updateStatus("Creant la primera peça musical...");
        const prompt = `Estil musical: ${this.inspiracioMestra}. Genera una peça d'introducció atmosfèrica i acollidora, un loop instrumental d'un minut.`;
        const novesPistes = await AI.generarMusica(this.apiKey, prompt);
        if (novesPistes) {
            await AudioManager.carregarPistes(novesPistes);
            AudioManager.reproduirTot();
            UI.updateMusicStatus(true, "Introducció");
            this.contextActual.mood = "introducció";
            UI.updateStatus("Sessió iniciada. Fes clic a 'Començar a Escoltar'.");
        } else {
            UI.updateStatus("Error creant la música inicial. Comprova la teva API Key o la connexió.");
        }
    },

    toggleListening() {
        if (!this.isSessionActive) return;
        if (Speech.isListening) {
            Speech.stopListening();
            UI.toggleListeningBtn.textContent = "Començar a Escoltar";
            if (this.intervalId) clearInterval(this.intervalId);
            this.intervalId = null;
        } else {
            Speech.startListening();
            UI.toggleListeningBtn.textContent = "Aturar Escolta";
            this.iniciarBuclePrincipal();
        }
    },

    iniciarBuclePrincipal() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive || !Speech.isListening || this.isProcessing) return;
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) {
                UI.updateStatus("Escoltant...", true);
                return;
            }
            this.isProcessing = true;
            UI.updateStatus("Analitzant narració...");
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            console.log("Resposta de la IA:", nouContext);
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                UI.updateStatus(`Nou ambient: ${nouContext.mood}. Generant música...`);
                this.contextActual = nouContext;
                const prompt = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} en ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera un loop instrumental d'un minut atmosfèric.`;
                const novesPistes = await AI.generarMusica(this.apiKey, prompt);
                if (novesPistes) {
                    await AudioManager.carregarPistes(novesPistes);
                    AudioManager.reproduirTot();
                    UI.updateMusicStatus(true, `${nouContext.mood}`);
                }
            }
            this.isProcessing = false;
        }, DIRECTOR_CONFIG.analysisInterval);
    },
    
    stopMusic() {
        AudioManager.aturarTot();
        UI.updateMusicStatus(false);
    },

    aturarSessio() {
        if (!this.isSessionActive) return;
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
        this.isSessionActive = false;
        Speech.stopListening();
        this.stopMusic();
        UI.updateStatus("Sessió finalitzada.");
        UI.showScreen('setup-screen');
    }
};
