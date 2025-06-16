// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    console.log("[main.js] Iniciant prova de foc de visibilitat...");

    // Ignorem tota la lògica anterior. Anem a forçar la visibilitat directament.
    // Això ens dirà si el problema és de CSS o d'una altra cosa.
    
    const apiKeyScreen = document.getElementById('api-key-screen');
    const setupScreen = document.getElementById('setup-screen');
    const sessionScreen = document.getElementById('session-screen');

    if (apiKeyScreen) {
        console.log("[main.js] Forçant la visibilitat de #api-key-screen amb style.display = 'block'");
        apiKeyScreen.style.display = 'block';
    } else {
        console.error("[main.js] No s'ha trobat #api-key-screen durant la prova de foc.");
    }

    // Amaguem les altres explícitament per si de cas.
    if (setupScreen) setupScreen.style.display = 'none';
    if (sessionScreen) sessionScreen.style.display = 'none';

    // De moment, no afegim cap event listener per mantenir la prova el més simple possible.
    // L'objectiu és només veure si la pantalla apareix.
});
