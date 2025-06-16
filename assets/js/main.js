// FILE: assets/js/main.js
import { APP_VERSION } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

// Aquest esdeveniment s'assegura que tot el HTML està carregat abans d'executar el codi.
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialitzem la UI i li passem la versió de l'app
    UI.init(APP_VERSION);

    // Listener per al botó d'iniciar la sessió.
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
