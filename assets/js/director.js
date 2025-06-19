import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
    apiKey: null, inspiracioMestra: "", contextActual: { mood: 'inici' },
    bibliotecaSessio: {}, intervalId: null, isSessionActive: false,
    isProcessing: false, fullTranscript: "",

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
        
        if (!speechSupported) UI.updateStatus("Error: El reconeixement de veu no és compatible.");
        UI.updateStatus("Sessió preparada. Fes clic a 'Començar a Escoltar'.");
    },

    toggleListening() { /* ... (contingut sense canvis) ... */ },
    iniciarBuclePrincipal() { /* ... (contingut sense canvis) ... */ },
    stopMusic() { /* ... (contingut sense canvis) ... */ },
    aturarSessio() { /* ... (contingut sense canvis) ... */ }
};
