// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    // Funció per inicialitzar els listeners de l'onboarding
    const setupOnboardingListeners = () => {
        const onboardingContainer = document.getElementById('onboarding-container');
        if (!onboardingContainer) return;
        const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');
        const dotsContainer = document.getElementById('onboarding-dots');
        let currentSlide = 0;
        if(dotsContainer.children.length === 0) { // Evitem duplicar els punts
            for(let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('progress-dot');
                dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer.querySelectorAll('.progress-dot');
        const updateOnboardingUI = () => {
            slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentSlide));
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === slides.length - 1;
        };
        nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
        prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
        updateOnboardingUI();
    };

    if (apiKey) {
        UI.showScreen('setupScreen');
    } else {
        UI.showScreen('apiKeyScreen');
        setupOnboardingListeners();
    }

    // --- LÒGICA DELS EVENT LISTENERS ---

    UI.saveApiKeyBtn.addEventListener('click', () => {
        const keyInput = UI.apiKeyInput.value.trim();
        if (keyInput.startsWith('hf_')) {
            apiKey = keyInput;
            localStorage.setItem(API_KEY_STORAGE_ID, apiKey);
            UI.showScreen('setupScreen');
        } else {
            alert("La clau de l'API no és vàlida.");
        }
    });
    
    UI.changeApiKeyBtn.addEventListener('click', () => {
        if (confirm("Vols esborrar la teva API Key?")) {
            apiKey = null;
            localStorage.removeItem(API_KEY_STORAGE_ID);
            Director.aturarSessio();
            UI.showScreen('apiKeyScreen');
            setupOnboardingListeners();
        }
    });

    UI.startSessionBtn.addEventListener('click', async () => {
        const inspiracio = UI.masterInspirationInput.value;
        if (!inspiracio.trim()) {
            alert("Si us plau, introdueix una inspiració mestra.");
            return;
        }
        apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
        if (!apiKey) {
            UI.showScreen('apiKeyScreen');
            return;
        }
        await AudioManager.init();
        Director.init(apiKey, inspiracio);
    });

    UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
    UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
    UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
    
    UI.soundboard.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.sound) {
            AudioManager.playSoundEffect(button.dataset.sound);
        }
    });

    if (UI.dmEffectsPanel) {
        UI.dmEffectsPanel.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.effect) {
                AudioManager.triggerDMEffect(button.dataset.effect);
            }
        });
    }
});
