// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    function setupAllListeners() {
        // Onboarding
        const onboardingContainer = document.getElementById('onboarding-container');
        if (onboardingContainer) {
            const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
            const prevBtn = document.getElementById('onboarding-prev');
            const nextBtn = document.getElementById('onboarding-next');
            const dotsContainer = document.getElementById('onboarding-dots');
            let currentSlide = 0;
            if(dotsContainer && dotsContainer.children.length === 0) {
                for(let i = 0; i < slides.length; i++) {
                    const dot = document.createElement('div'); dot.classList.add('progress-dot'); dotsContainer.appendChild(dot);
                }
            }
            const dots = dotsContainer.querySelectorAll('.progress-dot');
            const updateOnboardingUI = () => {
                slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentSlide));
                dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
                prevBtn.style.display = (currentSlide === 0) ? 'none' : 'inline-block';
                nextBtn.style.display = (currentSlide === slides.length - 1) ? 'none' : 'inline-block';
            };
            nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
            prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
            updateOnboardingUI();
        }
        
        // Listeners principals
        if(UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => { /*...*/ });
        if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => { /*...*/ });
        if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            const inspiracio = UI.masterInspirationInput.value;
            apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) { UI.showScreen('api-key-screen'); return; }
            await AudioManager.init();
            Director.init(apiKey, inspiracio);
        });

        // Listeners de la sessió
        if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if(UI.stopMusicBtn) UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
        if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        if(UI.soundboard) UI.soundboard.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.sound) AudioManager.playSoundEffect(button.dataset.sound);
        });

        // Listeners del modal i log
        if(UI.showHelpBtn) UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
        if(UI.closeHelpBtn) UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
        if(UI.toggleLogBtn) UI.toggleLogBtn.addEventListener('click', () => UI.toggleLogPanel());
        if(UI.helpModalOverlay) UI.helpModalOverlay.addEventListener('click', (e) => { if (e.target === UI.helpModalOverlay) UI.hideHelpModal(); });
    }
    
    setupAllListeners();

    if (apiKey) {
        UI.showScreen('setup-screen');
    } else {
        UI.showScreen('api-key-screen');
    }
});
