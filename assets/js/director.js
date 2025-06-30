// FILE: assets/js/director.js
import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
    apiKey: null,
    inspiracioMestra: "",
    soundLibrary: null,
    contextActual: { mood: 'principal' },
    isSessionActive: false,
    isProcessing: false,
    fullTranscript: "",
    intervalId: null,

    async init(apiKey, inspiracio, soundLibrary) {
        if (this.isSessionActive) return;
        this.isSessionActive = true;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio;
        this.soundLibrary = soundLibrary;
        
        UI.showScreen('session-screen');
        UI.addTimelineEvent("Sessió inicialitzada.", "fa-solid fa-play", "success");
        if(UI.currentInspirationDisplay) UI.currentInspirationDisplay.textContent = `Tema: ${inspiracio}`;
        if(UI.showHelpBtn) UI.showHelpBtn.classList.remove('hidden');
        UI.updateTranscript("");
        UI.setButtonActive(UI.toggleListeningBtn, false);
        UI.setButtonActive(UI.toggleMusicBtn, false);
        
        const speechSupported = Speech.init(
            (interimText) => { UI.updateTranscript(this.fullTranscript + interimText); },
            (finalText) => { this.fullTranscript += finalText; }
        );
        if (!speechSupported) UI.addTimelineEvent("Error: Reconeixement de veu no compatible.", "fa-solid fa-triangle-exclamation", "error");
        
        // Comencem amb el tema principal del pack seleccionat
        this.canviarMusicaPerContext({ mood: 'principal' });
    },
    
    toggleListening() {
        if (!this.isSessionActive) return;
        const isCurrentlyListening = Speech.isListening;
        UI.setButtonActive(UI.toggleListeningBtn, !isCurrentlyListening);
        if (isCurrentlyListening) {
            Speech.stopListening();
            UI.updateStatus("Escolta en pausa.");
            if (this.intervalId) clearInterval(this.intervalId);
        } else {
            Speech.startListening();
            UI.updateStatus("Escoltant...");
            this.iniciarBuclePrincipal();
        }
    },

    toggleMusicPlayback() {
        AudioManager.togglePlayback();
    },

    canviarMusicaPerContext(nouContext) {
        if (!nouContext || !nouContext.mood) return;
        const mood = nouContext.mood;
        // Busquem la pista al nostre soundLibrary
        const pistaUrl = this.soundLibrary[mood] || this.soundLibrary['principal'];
        
        if (pistaUrl && pistaUrl !== AudioManager.currentTrackUrl) {
            this.contextActual = nouContext;
            AudioManager.reproduirPista(pistaUrl, mood);
            UI.addTimelineEvent(`Canviant a l'ambient: ${mood}`, 'fa-solid fa-music', 'info');
        } else if (!pistaUrl) {
            UI.addTimelineEvent(`No s'ha trobat música per a l'ambient '${mood}'.`, 'fa-solid fa-triangle-exclamation', 'error');
        }
    },
    
    iniciarBuclePrincipal() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive || !Speech.isListening || this.isProcessing) return;
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
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
        this.isSessionActive = false;
        if (Speech.isListening) Speech.stopListening();
        AudioManager.aturarTot(0.5);
        UI.updateStatus("Sessió finalitzada.");
        UI.showScreen('setup-screen');
        if(UI.showHelpBtn) UI.showHelpBtn.classList.add('hidden');
    }
};
