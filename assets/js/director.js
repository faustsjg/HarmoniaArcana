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

    // La funció d'inicialització ara només prepara la pantalla, no genera música.
    init(apiKey, inspiracio) {
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
        
        // Missatge inicial clar per a l'usuari.
        UI.updateStatus("Sessió preparada. Fes clic a 'Començar a Escoltar'.");
        // Hem eliminat la crida a generar música des d'aquí per evitar errors a l'inici.
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

    // El bucle principal ara gestionarà la primera generació de música.
    iniciarBuclePrincipal() {
        if (this.intervalId) clearInterval(this.intervalId);

        // Funció per generar música
        const canviarMusicaPerContext = async (nouContext) => {
            this.isProcessing = true;
            UI.updateStatus(`Nou ambient: ${nouContext.mood}. Generant música...`);
            this.contextActual = nouContext;
            
            const prompt = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} en ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera un loop instrumental d'un minut atmosfèric.`;
            const novesPistes = await AI.generarMusica(this.apiKey, prompt);
            
            if (novesPistes) {
                await AudioManager.carregarPistes(novesPistes);
                AudioManager.reproduirTot();
                UI.updateMusicStatus(true, `${nouContext.mood}`);
            } else {
                 UI.updateStatus("Error en la generació. Comprova la consola.");
            }
            this.isProcessing = false;
        };
        
        // Generem música d'introducció la primera vegada que s'activa l'escolta.
        canviarMusicaPerContext({ mood: "introducció", location: "inici de l'aventura", keywords: ["expectació"] });

        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive || !Speech.isListening || this.isProcessing) return;
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) {
                UI.updateStatus("Escoltant...", true);
                return;
            }
            
            UI.updateStatus("Analitzant narració...");
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                await canviarMusicaPerContext(nouContext);
            }
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
        if (Speech.isListening) this.toggleListening(); // Atura l'escolta si està activa
        this.stopMusic();
        UI.updateStatus("Sessió finalitzada.");
        UI.showScreen('setup-screen');
    }
};
