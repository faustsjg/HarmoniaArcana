// FILE: assets/js/director.js
import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
    apiKey: null, inspiracioMestra: "", contextActual: { mood: 'inici' },
    isSessionActive: false, isProcessing: false, fullTranscript: "", intervalId: null,

    async init(apiKey, inspiracio) {
        if (this.isSessionActive) return;
        this.isSessionActive = true;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio.trim() || "Fantasia èpica i aventurera";
        this.fullTranscript = "";
        
        UI.showScreen('session-screen');
        UI.logToActionPanel("Sessió inicialitzada.", "success");
        if(UI.currentInspirationDisplay) UI.currentInspirationDisplay.textContent = `Inspiració: ${this.inspiracioMestra}`;
        if(UI.showHelpBtn) UI.showHelpBtn.classList.remove('hidden');
        UI.updateTranscript("");
        UI.setButtonActive(UI.toggleListeningBtn, false);
        
        const speechSupported = Speech.init(
            (interimText) => { UI.updateTranscript(this.fullTranscript + interimText); },
            (finalText) => { this.fullTranscript += finalText; }
        );
        if (!speechSupported) UI.logToActionPanel("Error: Reconeixement de veu no compatible.", "error");
        
        AudioManager.playStandbyMusic();
        UI.updateStatus("Generant tema principal en segon pla...");
        this.canviarMusicaPerContext({ mood: "tema principal", location: "inici de l'aventura", keywords: ["èpic"] });
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

    toggleMusicPlayback() { AudioManager.toggleAiMusicPlayback(); },

    async canviarMusicaPerContext(nouContext) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        UI.logToActionPanel(`Director: Generant capes per a '${nouContext.mood}'...`, 'info');
        UI.updateMusicStatus({
            isPlaying: AudioManager.isStandbyPlaying,
            title: `Generant: ${nouContext.mood}`,
            subtitle: "Contactant amb la IA..."
        });

        const promptHarmonia = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} a ${nouContext.location}. Genera només la base harmònica i atmosfèrica, notes llargues, sense percussió. loop instrumental d'un minut.`;
        const promptRitme = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} a ${nouContext.location}. Genera només la percussió i el ritme, sense melodia. loop instrumental d'un minut.`;

        const [pistaHarmonia, pistaRitme] = await Promise.all([
            AI.generarMusica(this.apiKey, promptHarmonia, 'harmonia'),
            AI.generarMusica(this.apiKey, promptRitme, 'ritme')
        ]);
        
        if (pistaHarmonia && pistaRitme) {
            this.contextActual = nouContext;
            await AudioManager.carregarPistes({ ...pistaHarmonia, ...pistaRitme });
            AudioManager.reproduirAITot();
            UI.updateMusicStatus({isPlaying: true, title: `${nouContext.mood}`.replace(/^\w/, c => c.toUpperCase()), subtitle: this.inspiracioMestra});
        } else {
            UI.logToActionPanel("Director: Error generant capes. La música d'espera continuarà.", 'error');
            UI.updateMusicStatus({isPlaying: true, title: "Música d'espera", subtitle: "Hi ha hagut un error amb la IA"});
        }
        this.isProcessing = false;
    },
    
    iniciarBuclePrincipal() {
        if (this.intervalId) clearInterval(this.intervalId);
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
    
    aturarSessio() {
        if (!this.isSessionActive) return;
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
        this.isSessionActive = false;
        if (Speech.isListening) Speech.stopListening();
        AudioManager.stopStandbyMusic(0.1);
        AudioManager.aturarAITot(0.1, true);
        UI.updateStatus("Sessió finalitzada.");
        UI.showScreen('setup-screen');
        if(UI.showHelpBtn) UI.showHelpBtn.classList.add('hidden');
    }
};