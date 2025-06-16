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

    init(apiKey, inspiracio) {
        if (this.isSessionActive) return;

        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio;
        this.isSessionActive = true;
        
        UI.showScreen('sessionScreen');
        UI.showDMPanel();
        
        const speechSupported = Speech.init((text) => {});
        
        if (speechSupported) {
            Speech.startListening();
            UI.updateStatus("Sessió iniciada. Escoltant...", true);
        } else {
            UI.updateStatus("Error: El reconeixement de veu no és compatible.");
        }
        
        this.iniciarBuclePrincipal();
    },

    iniciarBuclePrincipal() {
        if (this.intervalId) clearInterval(this.intervalId);

        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive) return;

            const textBuffer = Speech.getAndClearBuffer();
            
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) {
                // Si no hi ha prou text, simplement ens assegurem que l'estat visual és correcte.
                UI.updateStatus("Escoltant...", true);
                return;
            }

            UI.updateStatus("Analitzant narració...");
            
            // PAS CLAU: Enviem el text a la IA per a l'anàlisi.
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            
            if (nouContext && nouContext.mood) {
                console.log("Director: Nou context rebut de la IA:", nouContext);
                UI.updateStatus(`Nou ambient detectat: ${nouContext.mood}`);

                // --- PAS FUTUR: AQUÍ CRIDAREM LA GENERACIÓ DE MÚSICA ---
                // if (nouContext.mood !== this.contextActual.mood) {
                //    ...lògica per canviar de música...
                // }
            } else {
                console.log("Director: La IA no ha pogut determinar un context clar.");
            }
            
            // Després d'analitzar, tornem a l'estat d'escolta.
            setTimeout(() => {
                 if (this.isSessionActive) {
                    UI.updateStatus("Escoltant...", true);
                 }
            }, 2000); // Una petita pausa per llegir l'estat abans que torni a "Escoltant..."

        }, DIRECTOR_CONFIG.analysisInterval);
    },

    aturarSessio() {
        if (!this.isSessionActive) return;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isSessionActive = false;
        Speech.stopListening();
        AudioManager.aturarTot();
        this.contextActual = { mood: 'inici' };
        UI.updateStatus("Sessió finalitzada. Llest per a una nova aventura.");
        UI.showScreen('setupScreen');
        UI.hideDMPanel();
        console.log("Director: Sessió aturada.");
    }
};
