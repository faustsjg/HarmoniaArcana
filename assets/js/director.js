// FILE: assets/js/director.js
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
        UI.toggleListeningBtn.textContent = "Començar a Escoltar";
        
        const speechSupported = Speech.init(
            (interimText) => { UI.updateTranscript(this.fullTranscript + interimText); },
            (finalText) => { this.fullTranscript += finalText; }
        );
        
        if (!speechSupported) UI.updateStatus("Error: El reconeixement de veu no és compatible.");
        else UI.updateStatus("Sessió preparada. Fes clic a 'Començar a Escoltar' per generar la música inicial.");
    },

    toggleListening() {
        if (!this.isSessionActive) return;
        if (Speech.isListening) {
            Speech.stopListening();
            UI.toggleListeningBtn.textContent = "Començar a Escoltar";
            UI.updateStatus("Escolta en pausa.", false);
            if (this.intervalId) clearInterval(this.intervalId);
        } else {
            Speech.startListening();
            UI.toggleListeningBtn.textContent = "Aturar Escolta";
            UI.updateStatus("Escoltant...", true);
            // Si és la primera vegada, generem la música. Si no, simplement continuem l'anàlisi.
            if (this.contextActual.mood === 'inici') {
                this.iniciarBuclePrincipal(true); // true = forçar generació
            } else {
                this.iniciarBuclePrincipal(false); // false = només analitzar
            }
        }
    },

    async canviarMusicaPerContext(nouContext) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        UI.logToActionPanel(`Director: Canvi de 'mood' detectat a '${nouContext.mood}'. Generant noves capes...`, 'info');
        
        const promptHarmonia = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} a ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera només la base harmònica i atmosfèrica, notes llargues, sense percussió ni melodia principal.`;
        const promptRitme = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} a ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera només la percussió i el ritme, sense harmonia ni melodia.`;

        // Generem les dues capes en paral·lel per estalviar temps.
        const [pistaHarmonia, pistaRitme] = await Promise.all([
            AI.generarMusica(this.apiKey, promptHarmonia, 'harmonia'),
            AI.generarMusica(this.apiKey, promptRitme, 'ritme')
        ]);
        
        if (pistaHarmonia && pistaRitme) {
            UI.logToActionPanel("Director: Totes les capes generades. Carregant a l'AudioManager...", 'info');
            this.contextActual = nouContext;
            const capesNoves = { ...pistaHarmonia, ...pistaRitme };
            this.bibliotecaSessio[nouContext.mood] = capesNoves; // Guardem les capes a la biblioteca
            await AudioManager.carregarPistes(capesNoves);
            AudioManager.reproduirTot();
            UI.updateMusicStatus(true, `${nouContext.mood} (capes)`);
        } else {
            UI.logToActionPanel("Director: Error en la generació d'una o més capes.", 'error');
        }
        this.isProcessing = false;
    },
    
    iniciarBuclePrincipal(forcarMusicaInicial = false) {
        if (this.intervalId) clearInterval(this.intervalId);

        if (forcarMusicaInicial) {
            this.canviarMusicaPerContext({ mood: "introducció", location: "el principi de l'aventura", keywords: ["calma", "misteri"] });
        }

        this.intervalId = setInterval(async () => {
            if (!this.isSessionActive || !Speech.isListening || this.isProcessing) return;
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
            
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                await this.canviarMusicaPerContext(nouContext);
            }
        }, DIRECTOR_CONFIG.analysisInterval);
    },
    
    stopMusic() { /* ... */ },
    aturarSessio() { /* ... */ }
};
