// FILE: assets/js/director.js
import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

const soundLibrary = {
    'inici': { url: './assets/sounds/tema_principal.mp3', name: 'Tema Principal' },
    'combat': { url: './assets/sounds/tema_combat.mp3', name: 'Combat' },
    // Afegeix més moods i les seves pistes aquí
    'default': { url: './assets/sounds/tema_principal.mp3', name: 'Tema Principal' }
};

export const Director = {
    apiKey: null,
    contextActual: { mood: 'inici' },
    isSessionActive: false,
    intervalId: null,
    fullTranscript: "",

    async init(apiKey) {
        if (this.isSessionActive) return;
        this.isSessionActive = true;
        this.apiKey = apiKey;
        UI.showScreen('session-screen');
        UI.updateStatus("Sessió preparada. Fes clic a 'Escoltar'.");
        
        const speechSupported = Speech.init(
            (text) => { this.fullTranscript += text; UI.updateTranscript(this.fullTranscript); }
        );
        if (!speechSupported) UI.updateStatus("Error: Reconeixement de veu no compatible.");
        
        this.canviarMusicaPerContext({ mood: 'inici' });
    },

    canviarMusicaPerContext(nouContext) {
        const mood = nouContext.mood;
        const pista = soundLibrary[mood] || soundLibrary['default'];
        if (pista.url === AudioManager.currentTrackUrl) return; // Evitem reiniciar la mateixa cançó
        
        this.contextActual = nouContext;
        AudioManager.reproduirPista(pista.url, pista.name);
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

    aturarSessio() {
        if (!this.isSessionActive) return;
        this.isSessionActive = false;
        if (this.intervalId) clearInterval(this.intervalId);
        if (Speech.isListening) Speech.stopListening();
        AudioManager.aturarTot(0.5);
        UI.updateStatus("Sessió finalitzada.");
        UI.showScreen('setup-screen');
    }
};
