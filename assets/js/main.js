// FILE: assets/js/main.js
import { APP_VERSION } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

// Aquest esdeveniment s'assegura que tot el HTML està carregat abans d'executar el codi.
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialitzem la UI i li passem la versió de l'app
    UI.init(APP_VERSION);

    // Listener per al botó d'iniciar la sessió.// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    // Comprova si ja tenim una API Key guardada i mostra la pantalla corresponent.
    if (apiKey) {
        UI.showScreen('setupScreen');
        UI.updateStatus("Llest per començar una nova sessió.");
    } else {
        UI.showScreen('apiKeyScreen');
    }

    // --- LÒGICA DELS EVENT LISTENERS ---

    // Botó per desar la nova API Key.
    UI.saveApiKeyBtn.addEventListener('click', () => {
        const keyInput = UI.apiKeyInput.value.trim();
        if (keyInput.startsWith('hf_')) {
            apiKey = keyInput;
            localStorage.setItem(API_KEY_STORAGE_ID, apiKey);
            UI.showScreen('setupScreen');
            UI.updateStatus("API Key desada. Llest per començar.");
        } else {
            alert("La clau de l'API no és vàlida. Ha de començar per 'hf_'.");
        }
    });
    
    // Botó per canviar una API Key ja existent.
    UI.changeApiKeyBtn.addEventListener('click', () => {
        if (confirm("Estàs segur que vols esborrar la teva API Key actual i introduir-ne una de nova?")) {
            apiKey = null;
            localStorage.removeItem(API_KEY_STORAGE_ID);
            Director.aturarSessio(); // Aturem qualsevol sessió activa.
            UI.showScreen('apiKeyScreen');
            UI.updateStatus("Si us plau, introdueix una nova API Key.");
        }
    });

    // Botó per iniciar la sessió.
    UI.startSessionBtn.addEventListener('click', async () => {
        const inspiracio = UI.masterInspirationInput.value;
        if (!inspiracio.trim()) {
            alert("Si us plau, introdueix una inspiració mestra.");
            return;
        }

        apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
        if (!apiKey) {
            alert("No s'ha trobat cap API Key. Si us plau, configura-la primer.");
            UI.showScreen('apiKeyScreen');
            return;
        }

        UI.updateStatus("Inicialitzant motor d'àudio...");
        await AudioManager.init();
        
        Director.init(apiKey, inspiracio);
    });

    // Botó per aturar la sessió.
    UI.stopSessionBtn.addEventListener('click', () => {
        Director.aturarSessio();
    });

    // Panell d'efectes del DM.
    UI.dmEffectsPanel.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.effect) {
            AudioManager.triggerDMEffect(button.dataset.effect);
        }
    });
});
    UI.startSessionBtn.addEventListener('click', async () => {
        const inspiracio = UI.masterInspirationInput.value;
        if (!inspiracio.trim()) {
            alert("Si us plau, introdueix una inspiració mestra.");
            return;
        }

        // IMPORTANT: Inicialitzem l'àudio DESPRÉS d'una interacció de l'usuari.
        // Això és un requisit de la majoria de navegadors moderns.
        UI.updateStatus("Inicialitzant motor d'àudio...");
        await AudioManager.init();
        
        // Comença la màgia: passem el control al Director.
        Director.init(inspiracio);
    });

    // Listener per al botó d'aturar la sessió.
    UI.stopSessionBtn.addEventListener('click', () => {
        Director.aturarSessio();
    });

    // Listener per al panell d'efectes del DM.
    UI.dmEffectsPanel.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.effect) {
            AudioManager.triggerDMEffect(button.dataset.effect);
        }
    });

});
