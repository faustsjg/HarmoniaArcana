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
        // Si la inspiració és buida, en posem una per defecte.
        this.inspiracioMestra = inspiracio.trim() || "Música èpica d'aventures de fantasia";
        this.isSessionActive = true;
        this.fullTranscript = "";
        
        UI.showScreen('session-screen');
        UI.updateStatus("Preparant la teva aventura musical...");
        UI.updateTranscript("");
        UI.updateMusicStatus(false);
        
        const speechSupported = Speech.init((text) => {
            this.fullTranscript += text + " ";
            UI.updateTranscript(this.fullTranscript);
        });
        
        if (!speechSupported) UI.updateStatus("Error: El reconeixement de veu no és compatible.");

        // NOU: Generem música només començar la sessió.
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
            UI.updateStatus("Error creant la música inicial.");
        }
    },

    toggleListening() { /* ... (sense canvis) ... */ },
    iniciarBuclePrincipal() { /* ... (sense canvis) ... */ },
    stopMusic() { /* ... (sense canvis) ... */ },

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
    }
};
