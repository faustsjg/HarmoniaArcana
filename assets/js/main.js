// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);

    function setupOnboardingListeners() {
        const onboardingContainer = document.getElementById('onboarding-container');
        if (!onboardingContainer) return;
        const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');
        const dotsContainer = document.getElementById('onboarding-dots');
        let currentSlide = 0;
        
        if (dotsContainer.children.length === 0) {
            for(let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div'); dot.classList.add('progress-dot'); dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer.querySelectorAll('.progress-dot');
        
        const updateOnboardingUI = () => {
            if (!slides.length || !dots.length || !prevBtn || !nextBtn) return;
            slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentSlide));
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            prevBtn.style.display = (currentSlide === 0) ? 'none' : 'inline-block';
            nextBtn.style.display = (currentSlide === slides.length - 1) ? 'none' : 'inline-block';
        };

        nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
        prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
        updateOnboardingUI();
    };

    // Listener del botó "Desar Token" amb depuració visual
    if (UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
        UI.updateStatus("1: Botó 'Desar' premut.");
        const keyInput = UI.apiKeyInput.value.trim();
        UI.updateStatus(`2: Clau llegida: ${keyInput.substring(0, 8)}...`);

        if (keyInput.startsWith('hf_')) {
            UI.updateStatus("3: La clau sembla vàlida. Desant...");
            localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
            
            const savedKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (savedKey === keyInput) {
                UI.updateStatus("4: Clau desada correctament! Canviant de pantalla...");
                UI.showScreen('setup-screen');
            } else {
                UI.updateStatus("ERROR: La clau no s'ha pogut desar a localStorage.");
            }
        } else {
            UI.updateStatus("ERROR: La clau no comença per 'hf_'.");
            alert("La clau de l'API no és vàlida. Ha de començar per 'hf_'.");
        }
    });
    
    // La resta de listeners
    if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => { window.location.reload(); });
    if(UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
        const inspiracio = UI.masterInspirationInput.value;
        const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
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

    // Lògica inicial
    if (apiKey) {
        UI.showScreen('setup-screen');
    } else {
        UI.showScreen('api-key-screen');
        setupOnboardingListeners();
    }
});
