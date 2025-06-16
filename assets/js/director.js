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

    init(apiKey, inspiracio) {
        if (this.isSessionActive) return;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio;
        this.isSessionActive = true;
        this.fullTranscript = "";
        
        // CORRECCIÓ: Utilitzem l'ID correcte 'session-screen' amb guió.
        UI.showScreen('session-screen');
        UI.showDMPanel();
        UI.updateStatus("Sessió iniciada. Fes clic a 'Començar a Escoltar'.");
        UI.updateTranscript("");
        UI.updateMusicStatus(false);
        
        const speechSupported = Speech.init((text) => {
            this.fullTranscript += text + " ";
            UI.updateTranscript(this.fullTranscript);
        });
        
        if (!speechSupported) UI.updateStatus("Error: El reconeixement de veu no és compatible.");
    },

    toggleListening() {
        if (!this.isSessionActive) return;

        if (Speech.isListening) {
            Speech.stopListening();
            UI.toggleListeningBtn.textContent = "Començar a Escoltar";
            UI.toggleListeningBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
            UI.toggleListeningBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
            if (this.intervalId) clearInterval(this.intervalId);
            this.intervalId = null;
        } else {
            Speech.startListening();
            UI.toggleListeningBtn.textContent = "Aturar Escolta";
            UI.toggleListeningBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
            UI.toggleListeningBtn.classList.add('bg-red-600', 'hover:bg-red-700');
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
            
            UI.updateStatus("Escoltant...", true);
            this.isProcessing = false;
        }, DIRECTOR_CONFIG.analysisInterval);
    },
    
    stopMusic() {
        AudioManager.aturarTot();
        UI.updateMusicStatus(false);
    },

    aturarSessio() {
        if (!this.isSessionActive) return;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isSessionActive = false;
        Speech.stopListening();
        this.stopMusic();
        UI.updateStatus("Sessió finalitzada.");
        UI.showScreen('setup-screen');
        UI.hideDMPanel();
    }
};
