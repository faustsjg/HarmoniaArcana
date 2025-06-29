// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    
    function setupEventListeners() {
        if(UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                UI.showScreen('setup-screen');
            } else { alert("La clau de l'API no és vàlida."); }
        });
        
        if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => {
            if (confirm("Vols esborrar la teva API Key?")) {
                localStorage.removeItem(API_KEY_STORAGE_ID);
                window.location.reload();
            }
        });

        if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) { UI.showScreen('api-key-screen'); return; }
            await AudioManager.init();
            Director.init(apiKey);
        });

        if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
    }
    
    setupEventListeners();
    
    if (localStorage.getItem(API_KEY_STORAGE_ID)) {
        UI.showScreen('setup-screen');
    } else {
        UI.showScreen('api-key-screen');
    }
});
