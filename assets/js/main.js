// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    if (apiKey) {
        UI.showScreen('setupScreen');
    } else {
        UI.showScreen('apiKeyScreen');
        // Lògica de l'onboarding (copiada de la versió anterior)
        const onboardingContainer = document.getElementById('onboarding-container');
        const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');
        const dotsContainer = document.getElementById('onboarding-dots');
        let currentSlide = 0;
        for(let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('progress-dot');
            dotsContainer.appendChild(dot);
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
    }

    // --- LÒGICA DELS EVENT LISTENERS ---

    UI.saveApiKeyBtn.addEventListener('click', () => {
        // ... (codi sense canvis)
    });
    
    UI.changeApiKeyBtn.addEventListener('click', () => {
        // ... (codi sense canvis)
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

    // --- NOUS LISTENERS PER A LA SESSIÓ ACTIVA ---
    
    UI.toggleListeningBtn.addEventListener('click', () => {
        Director.toggleListening();
    });

    UI.stopMusicBtn.addEventListener('click', () => {
        Director.stopMusic();
    });

    UI.stopSessionBtn.addEventListener('click', () => {
        Director.aturarSessio();
    });
    
    UI.soundboard.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.sound) {
            AudioManager.playSoundEffect(button.dataset.sound);
        }
    });

    UI.dmEffectsPanel.addEventListener('click', (e) => {
        // ... (codi sense canvis)
    });
});
