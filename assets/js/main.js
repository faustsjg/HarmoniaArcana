// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    // Missatge de diagnòstic per saber què hem trobat
    console.log(`[main.js] Comprovant localStorage... API Key trobada?: ${apiKey ? 'SÍ' : 'NO'}`);

    if (apiKey) {
        console.log("[main.js] Decisió: Es mostrarà la pantalla de 'setup'.");
        UI.showScreen('setup-screen');
    } else {
        console.log("[main.js] Decisió: Es mostrarà la pantalla de 'api-key'.");
        UI.showScreen('api-key-screen');
    }

    // Lògica de l'onboarding (només s'activa si és necessari)
    const onboardingContainer = document.getElementById('onboarding-container');
    if (onboardingContainer) {
        const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');
        const dotsContainer = document.getElementById('onboarding-dots');
        let currentSlide = 0;
        if(dotsContainer && dotsContainer.children.length === 0) {
            for(let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('progress-dot');
                dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer.querySelectorAll('.progress-dot');
        const updateOnboardingUI = () => {
            if (!slides.length || !dots.length) return;
            slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentSlide));
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slides.length - 1;
        };
        if(nextBtn) nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
        if(prevBtn) prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
        updateOnboardingUI();
    }
    
    // --- LÒGICA DELS EVENT LISTENERS ---
    // Aquesta part no hauria de donar problemes, ja que els elements haurien d'existir.

    if(UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
        const keyInput = UI.apiKeyInput.value.trim();
        if (keyInput.startsWith('hf_')) {
            apiKey = keyInput;
            localStorage.setItem(API_KEY_STORAGE_ID, apiKey);
            UI.showScreen('setup-screen');
        } else {
            alert("La clau de l'API no és vàlida.");
        }
    });
    
    if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => {
        if (confirm("Vols esborrar la teva API Key?")) {
            apiKey = null;
            localStorage.removeItem(API_KEY_STORAGE_ID);
            if (Director.isSessionActive) Director.aturarSessio();
            UI.showScreen('api-key-screen');
        }
    });

    if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
        // ... (la resta de la lògica aquí dins)
    });
});
