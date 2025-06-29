import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

const musicLibrary = {
    'principal': { url: './assets/sounds/tema_principal.mp3', name: 'Tema Principal' },
    'combat':    { url: './assets/sounds/tema_combat.mp3', name: 'Tema de Combat' },
    // Afegeix aquí més temes en el futur
    // 'misteri': { url: './assets/sounds/tema_misteri.mp3', name: 'Tema de Misteri' },
};

export const Director = {
    apiKey: null,
    inspiracioMestra: "",
    contextActual: { mood: 'inici' },
    isSessionActive: false,
    intervalId: null,
    fullTranscript: "",

    async init(apiKey, inspiracio) {
        if (this.isSessionActive) return;
        this.isSessionActive = true;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio.trim() || "Aventura de Fantasia";
        
        UI.showScreen('session-screen');
        UI.currentInspirationDisplay.textContent = `Inspiració: ${this.inspiracioMestra}`;
        UI.updateStatus("Preparat. Fes clic a 'Escoltar' per començar.");

        const speechSupported = Speech.init(
            (interimText) => { UI.updateTranscript(this.fullTranscript + interimText); },
            (finalText) => { this.fullTranscript += finalText; }
        );
        if (!speechSupported) alert("Error: Reconeixement de veu no compatible.");
        
        // Comencem amb el tema principal
        this.canviarMusicaPerContext({ mood: 'principal' });
    },
    
    canviarMusicaPerContext(nouContext) {
        const mood = nouContext.mood;
        const trackInfo = musicLibrary[mood] || musicLibrary['principal'];
        
        if (trackInfo && trackInfo.url) {
            this.contextActual = nouContext;
            AudioManager.reproduirPista(trackInfo.url, trackInfo.name);
        } else {
            console.error(`No s'ha trobat música per a l'ambient '${mood}'.`);
        }
    },

    toggleListening() {
        const isCurrentlyListening = Speech.isListening;
        UI.setButtonActive(UI.toggleListeningBtn, !isCurrentlyListening);
        if (isCurrentlyListening) {
            Speech.stopListening();
            UI.updateStatus("Escolta en pausa.");
            if (this.intervalId) clearInterval(this.intervalId);
        } else {
            Speech.startListening();
            UI.updateStatus("Escoltant...");
            this.iniciarBucleAnalisi();
        }
    },
    
    iniciarBucleAnalisi() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive || !Speech.isListening) return;
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
            
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                this.canviarMusicaPerContext(nouContext);
            }
        }, DIRECTOR_CONFIG.analysisInterval);
    },

    toggleMusicPlayback() {
        AudioManager.togglePlayback();
    },

    aturarSessio() {
        if (!this.isSessionActive) return;
        this.isSessionActive = false;
        if (this.intervalId) clearInterval(this.intervalId);
        if (Speech.isListening) Speech.stopListening();
        AudioManager.aturarTot(0.5);
        UI.showScreen('setup-screen');
    }
};
