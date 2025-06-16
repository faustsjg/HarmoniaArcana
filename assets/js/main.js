// FILE: assets/js/main.js
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
        UI.updateStatus("Benvingut. Si us plau, completa la configuració inicial.");
    }

    // --- LÒGICA DE L'ONBOARDING ---
    const onboardingContainer = document.getElementById('onboarding-container');
    const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');
    const dotsContainer = document.getElementById('onboarding-dots');
    let currentSlide = 0;

    // Crear punts de progrés
    for(let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('progress-dot');
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.progress-dot');

    const updateOnboardingUI = () => {
        slides.forEach((slide, index) => {
            slide.classList.toggle('hidden', index !== currentSlide);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    };
    
    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateOnboardingUI();
        }
    });
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateOnboardingUI();
        }
    });

    updateOnboardingUI(); // Inicialitza la UI de l'onboarding

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
            currentSlide = 0; // Reseteja l'onboarding
            updateOnboardingUI();
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
        
        // **ARREGLAT L'ERROR DE L'ÀUDIO**
        // Inicialitzem l'àudio DESPRÉS d'aquesta interacció de l'usuari.
        UI.updateStatus("Inicialitzant motor d'àudio...");
        await AudioManager.init();
        
        // Comença la màgia: passem el control al Director.
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
