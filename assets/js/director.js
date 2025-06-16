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

    init(apiKey, inspiracio) {
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio;
        
        UI.updateStatus("Sessió iniciada. Escoltant la partida...");
        UI.showScreen('sessionScreen');
        UI.showDMPanel();
        
        const speechSupported = Speech.init((text) => {});
        if(speechSupported) Speech.startListening();
        
        this.iniciarBuclePrincipal();
    },

    iniciarBuclePrincipal() {
        this.intervalId = setInterval(async () => {
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) return;

            UI.updateStatus("Analitzant narració...");
            const nouContext = await AI.analisarContext(this.apiKey, textBuffer);
            
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                UI.updateStatus(`Nou ambient detectat: ${nouContext.mood}. Preparant música...`);
                this.contextActual = nouContext;
                
                const contextKey = `${nouContext.mood}_${nouContext.location.replace(/\s+/g, '_')}`;
                
                if (this.bibliotecaSessio[contextKey]) {
                    UI.updateStatus(`Reutilitzant música per a: ${nouContext.mood}`);
                    await AudioManager.carregarPistes(this.bibliotecaSessio[contextKey]);
                } else {
                    UI.updateStatus(`Generant nova música per a: ${nouContext.mood}...`);
                    const prompt = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} en ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera un loop instrumental d'un minut.`;
                    const novesPistes = await AI.generarMusica(this.apiKey, prompt);
                    
                    if (novesPistes) {
                        this.bibliotecaSessio[contextKey] = novesPistes;
                        await AudioManager.carregarPistes(novesPistes);
                    } else {
                        UI.updateStatus("Error en la generació de música.");
                    }
                }
                AudioManager.reproduirTot();
            } else {
                UI.updateStatus("Escoltant la partida...");
            }
        }, DIRECTOR_CONFIG.analysisInterval);
    },

    aturarSessio() {
        if(this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        Speech.stopListening();
        AudioManager.aturarTot();
        this.contextActual = { mood: 'inici' };
        UI.updateStatus("Sessió finalitzada. Llest per a una nova aventura.");
        UI.showScreen('setupScreen');
        UI.hideDMPanel();
        console.log("Director: Sessió aturada.");
    }
};
