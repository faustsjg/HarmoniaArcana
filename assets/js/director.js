// FILE: assets/js/director.js
import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
    // ... (propietats com apiKey, etc. es mantenen igual) ...
    apiKey: null, inspiracioMestra: "", contextActual: { mood: 'inici' },
    bibliotecaSessio: {}, intervalId: null, isSessionActive: false,
    isProcessing: false, fullTranscript: "",

    async init(apiKey, inspiracio) {
        if (this.isSessionActive) return;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio.trim() || "Música èpica d'aventures de fantasia";
        this.isSessionActive = true;
        this.fullTranscript = "";
        
        UI.showScreen('session-screen');
        UI.updateTranscript("");
        UI.updateMusicStatus(false);
        UI.toggleListeningBtn.textContent = "Començar a Escoltar";
        
        // Ara passem dues funcions a Speech.init
        const speechSupported = Speech.init(
            (interimText) => { // Per a resultats ràpids
                UI.updateTranscript(this.fullTranscript + interimText);
            },
            (finalText) => { // Per a resultats finals
                this.fullTranscript += finalText;
                UI.updateTranscript(this.fullTranscript);
            }
        );
        
        if (!speechSupported) UI.updateStatus("Error: El reconeixement de veu no és compatible.");
        else UI.updateStatus("Sessió preparada. Fes clic a 'Començar a Escoltar'.");
    },
    
    // ... (toggleListening es manté pràcticament igual) ...
    toggleListening() { /* ... */ },

    async iniciarBuclePrincipal() {
        if (this.intervalId) clearInterval(this.intervalId);

        const canviarMusicaPerContext = async (nouContext) => {
            if (this.isProcessing) return;
            this.isProcessing = true;
            UI.updateStatus(`Canvi de mood detectat a '${nouContext.mood}'. Generant música...`, true);
            
            const prompt = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} a ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera un loop instrumental d'un minut.`;
            const novesPistes = await AI.generarMusica(this.apiKey, prompt);
            
            if (novesPistes) {
                UI.updateStatus(`Música generada. Carregant pistes...`, true);
                this.contextActual = nouContext;
                await AudioManager.carregarPistes(novesPistes);
                AudioManager.reproduirTot();
                UI.updateMusicStatus(true, `${nouContext.mood}`);
            } else {
                UI.updateStatus("Error en la generació de música. Comprova la API Key o la connexió.", true);
            }
            this.isProcessing = false;
        };
        
        // Generem la música inicial
        await canviarMusicaPerContext({ mood: "introducció", location: "el principi de l'aventura", keywords: ["calma", "misteri"] });

        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive || !Speech.isListening || this.isProcessing) return;
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) {
                UI.updateStatus("Escoltant...", true);
                return;
            }
            
            UI.updateStatus("Analitzant narració...", true);
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            
            if (nouContext && nouContext.mood) {
                UI.updateStatus(`IA ha detectat el mood: '${nouContext.mood}'. Comparant amb '${this.contextActual.mood}'...`, true);
                if (nouContext.mood !== this.contextActual.mood) {
                    await canviarMusicaPerContext(nouContext);
                }
            } else {
                 UI.updateStatus(`La IA no ha pogut determinar un context clar.`, true);
            }
        }, DIRECTOR_CONFIG.analysisInterval);
    },
    
    // ... (stopMusic i aturarSessio es mantenen igual) ...
    stopMusic() { /*...*/ },
    aturarSessio() { /*...*/ }
};
