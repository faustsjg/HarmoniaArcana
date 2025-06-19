// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
    let inspiracio = "";

    // --- SETUP DE TOTS ELS EVENT LISTENERS (Patró robust) ---
    function setupAllListeners() {
        // Onboarding
        const onboardingContainer = document.getElementById('onboarding-container');
        if (onboardingContainer) { /* ... (la teva lògica d'onboarding aquí dins) ... */ }

        // Pantalla API Key
        if(UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                apiKey = keyInput;
                UI.showScreen('setup-screen');
            } else { alert("La clau de l'API no és vàlida."); }
        });

        // Pantalla de Setup
        if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => {
            if (confirm("Vols esborrar la teva API Key?")) {
                localStorage.removeItem(API_KEY_STORAGE_ID);
                window.location.reload();
            }
        });

        if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            inspiracio = UI.masterInspirationInput.value;
            apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) { UI.showScreen('api-key-screen'); return; }
            
            await AudioManager.init();
            Director.init(apiKey, inspiracio);
            UI.showHelpModal(); // Mostrem el popup d'ajuda en iniciar la sessió
        });

        // Pantalla de Sessió
        if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if(UI.stopMusicBtn) UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
        if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        if(UI.soundboard) UI.soundboard.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.sound) AudioManager.playSoundEffect(button.dataset.sound);
        });

        // Modal d'Ajuda
        if(UI.showHelpBtn) UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
        if(UI.closeHelpBtn) UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
        if(UI.helpModalOverlay) UI.helpModalOverlay.addEventListener('click', (e) => {
            if (e.target === UI.helpModalOverlay) UI.hideHelpModal();
        });
    }
    
    // --- LÒGICA D'INICI ---
    setupAllListeners();

    if (apiKey) {
        UI.showScreen('setup-screen');
    } else {
        UI.showScreen('api-key-screen');
    }
});
