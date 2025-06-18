// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    // Funció per configurar NOMÉS els listeners de l'onboarding.
    // Només es cridarà si és necessari.
    const setupOnboardingListeners = () => {
        const onboardingContainer = document.getElementById('onboarding-container');
        if (!onboardingContainer) return;
        const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');
        const dotsContainer = document.getElementById('onboarding-dots');
        let currentSlide = 0;
        
        if (dotsContainer && dotsContainer.children.length === 0) {
            for(let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('progress-dot');
                dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer.querySelectorAll('.progress-dot');
        
        const updateOnboardingUI = () => {
            if (!slides.length || !dots.length || !prevBtn || !nextBtn) return;
            slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentSlide));
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slides.length - 1;
        };
        
        nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
        prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
        
        updateOnboardingUI();
    };

    // Funció per configurar els listeners de les pantalles principals
    const setupMainAppListeners = () => {
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
                setupOnboardingListeners(); 
            }
        });

        if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            const inspiracio = UI.masterInspirationInput.value;
            apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) {
                UI.showScreen('api-key-screen');
                return;
            }
            await AudioManager.init();
            Director.init(apiKey, inspiracio);
        });

        if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if(UI.stopMusicBtn) UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
        if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        
        if(UI.soundboard) UI.soundboard.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.sound) AudioManager.playSoundEffect(button.dataset.sound);
        });
    };
    
    // --- LÒGICA PRINCIPAL D'INICI ---
    
    // Configurem sempre els listeners de l'aplicació.
    setupMainAppListeners();

    // I ara decidim quina pantalla mostrar.
    if (apiKey) {
        UI.showScreen('setup-screen');
    } else {
        UI.showScreen('api-key-screen');
        // Només configurem els botons de l'onboarding si mostrarem aquesta pantalla.
        setupOnboardingListeners();
    }
});
