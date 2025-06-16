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
    isProcessing: false, // Nova variable per evitar processaments simultanis

    init(apiKey, inspiracio) {
        if (this.isSessionActive) return;

        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio;
        this.isSessionActive = true;
        
        UI.showScreen('sessionScreen');
        UI.showDMPanel();
        
        const speechSupported = Speech.init(() => {});
        
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
            // Si ja estem processant una petició, no en comencem una altra.
            if (!this.isSessionActive || this.isProcessing) return;

            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) {
                UI.updateStatus("Escoltant...", true);
                return;
            }

            this.isProcessing = true; // Bloquegem noves anàlisis
            UI.updateStatus("Analitzant narració...");
            
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            
            // Comprovem si el mood ha canviat realment respecte a l'últim.
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                UI.updateStatus(`Nou ambient detectat: ${nouContext.mood}. Preparant música...`);
                this.contextActual = nouContext;
                
                const contextKey = `${nouContext.mood}_${nouContext.location.replace(/\s+/g, '_')}`;
                
                if (this.bibliotecaSessio[contextKey]) {
                    UI.updateStatus(`Reutilitzant música per a: ${nouContext.mood}`);
                    await AudioManager.carregarPistes(this.bibliotecaSessio[contextKey]);
                } else {
                    UI.updateStatus(`Generant nova música per a: ${nouContext.mood}...`);
                    const prompt = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} en ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera un loop instrumental d'un minut, que sigui atmosfèric i coherent.`;
                    const novesPistes = await AI.generarMusica(this.apiKey, prompt);
                    
                    if (novesPistes) {
                        this.bibliotecaSessio[contextKey] = novesPistes;
                        await AudioManager.carregarPistes(novesPistes);
                    } else {
                        UI.updateStatus("Error en la generació de música. Mantenint la música actual.");
                    }
                }
                AudioManager.reproduirTot();
            }
            
            UI.updateStatus("Escoltant...", true);
            this.isProcessing = false; // Desbloquegem per a la propera anàlisi

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
    }
};
