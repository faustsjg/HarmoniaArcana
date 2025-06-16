// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    // ... (Lògica de l'onboarding i comprovació de l'API key es manté igual) ...
    if (apiKey) { /*...*/ } else { /*...*/ }

    // --- LÒGICA DELS EVENT LISTENERS ---
    if(UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => { /*...*/ });
    if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => { /*...*/ });
    if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => { /*...*/ });
    if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
    if(UI.stopMusicBtn) UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
    if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
    if(UI.soundboard) UI.soundboard.addEventListener('click', (e) => { /*...*/ });

    // ELIMINAT: Ja no hi ha listener per al dmEffectsPanel
});
