// FILE: assets/js/director.js
import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
    inspiracioMestra: "",
    contextActual: { mood: 'inici' }, // Estat inicial
    bibliotecaSessio: {}, // La memòria cau de cançons generades
    intervalId: null, // Per controlar el bucle principal

    init(inspiracio) {
        this.inspiracioMestra = inspiracio;
        
        UI.updateStatus("Sessió iniciada. Escoltant la partida...");
        UI.showSessionScreen();
        UI.showDMPanel();
        
        const speechSupported = Speech.init((text) => console.log(`Text transcrit: ${text}`));
        if(speechSupported) Speech.startListening();
        
        this.iniciarBuclePrincipal();
    },

    // El bucle principal que s'executa periòdicament per avaluar la situació.
    iniciarBuclePrincipal() {
        this.intervalId = setInterval(async () => {
            const textBuffer = Speech.getAndClearBuffer();
            if (textBuffer.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) {
                console.log("Director: Buffer de text massa curt, esperant...");
                return;
            }

            UI.updateStatus("Analitzant narració...");
            const nouContext = await AI.analisarContext(textBuffer);
            
            if (nouContext && nouContext.mood && nouContext.mood !== this.contextActual.mood) {
                UI.updateStatus(`Nou ambient detectat: ${nouContext.mood}. Preparant música...`);
                this.contextActual = nouContext;
                
                // Creem una clau única per aquest context.
                const contextKey = `${nouContext.mood}_${nouContext.location.replace(/\s+/g, '_')}`;
                
                if (this.bibliotecaSessio[contextKey]) {
                    // Si ja tenim música per aquest context, la reutilitzem.
                    UI.updateStatus(`Reutilitzant música per a: ${nouContext.mood}`);
                    await AudioManager.carregarPistes(this.bibliotecaSessio[contextKey]);
                    AudioManager.reproduirTot();
                } else {
                    // Si no, generem música nova.
                    UI.updateStatus(`Generant nova música per a: ${nouContext.mood}...`);
                    const prompt = `Estil musical: ${this.inspiracioMestra}. Escena: ${nouContext.mood} en ${nouContext.location}. Paraules clau: ${nouContext.keywords.join(', ')}. Genera un loop instrumental d'un minut.`;
                    const novesPistes = await AI.generarMusica(prompt);
                    
                    if (novesPistes) {
                        this.bibliotecaSessio[contextKey] = novesPistes;
                        await AudioManager.carregarPistes(novesPistes);
                        AudioManager.reproduirTot();
                    } else {
                        UI.updateStatus("Error en la generació de música. Mantenint la música actual.");
                    }
                }
            } else {
                UI.updateStatus("Escoltant la partida...");
            }

        }, DIRECTOR_CONFIG.analysisInterval);
    },

    // Funció per aturar la sessió i netejar recursos.
    aturarSessio() {
        clearInterval(this.intervalId);
        Speech.stopListening();
        AudioManager.aturarTot();
        this.bibliotecaSessio = {};
        this.contextActual = { mood: 'inici' };
        UI.updateStatus("Sessió finalitzada.");
        UI.showSetupScreen();
        UI.hideDMPanel();
        console.log("Director: Sessió aturada i recursos netejats.");
    }
};
