// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);

    // --- SETUP DE TOTS ELS EVENT LISTENERS ---
    
    // Onboarding
    const onboardingContainer = document.getElementById('onboarding-container');
    const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');
    const dotsContainer = document.getElementById('onboarding-dots');
    let currentSlide = 0;

    function setupOnboarding() {
        if (!onboardingContainer) return;
        if (dotsContainer.children.length === 0) {
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
            prevBtn.style.display = (currentSlide === 0) ? 'none' : 'inline-block';
            nextBtn.style.display = (currentSlide === slides.length - 1) ? 'none' : 'inline-block';
        };

        nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
        prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
        updateOnboardingUI();
    }
    
    // Pantalla API Key
    UI.saveApiKeyBtn.addEventListener('click', () => {
        const keyInput = UI.apiKeyInput.value.trim();
        if (keyInput.startsWith('hf_')) {
            localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
            UI.showScreen('setup-screen');
        } else { alert("La clau de l'API no és vàlida."); }
    });

    // Pantalla de Setup
    UI.changeApiKeyBtn.addEventListener('click', () => {
        if (confirm("Vols esborrar la teva API Key?")) {
            localStorage.removeItem(API_KEY_STORAGE_ID);
            window.location.reload();
        }
    });

    UI.startSessionBtn.addEventListener('click', async () => {
        const inspiracio = UI.masterInspirationInput.value;
        const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
        if (!apiKey) { UI.showScreen('api-key-screen'); return; }
        
        await AudioManager.init();
        Director.init(apiKey, inspiracio);
    });

    // Pantalla de Sessió
    UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
    UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
    UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
    UI.soundboard.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.sound) AudioManager.playSoundEffect(button.dataset.sound);
    });

    // --- LÒGICA INICIAL PER MOSTRAR PANTALLA ---
    const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
    if (apiKey) {
        UI.showScreen('setup-screen');
    } else {
        UI.showScreen('api-key-screen');
        setupOnboarding();
    }
});
