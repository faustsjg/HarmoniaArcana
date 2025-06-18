// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);

    // --- SETUP DE TOTS ELS EVENT LISTENERS ---
    // Definim tots els listeners aquí per assegurar que sempre estiguin disponibles.

    // Onboarding
    const onboardingContainer = document.getElementById('onboarding-container');
    const slides = onboardingContainer.querySelectorAll('.onboarding-slide');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');
    const dotsContainer = document.getElementById('onboarding-dots');
    let currentSlide = 0;

    if (dotsContainer.children.length === 0) {
        for(let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('progress-dot');
            dotsContainer.appendChild(dot);
        }
    }
    const dots = dotsContainer.querySelectorAll('.progress-dot');
    
    function updateOnboardingUI() {
        slides.forEach((s, i) => s.classList.toggle('hidden', i !== currentSlide));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        const isFirstSlide = currentSlide === 0;
        const isLastSlide = currentSlide === slides.length - 1;
        prevBtn.style.display = isFirstSlide ? 'none' : 'inline-block';
        nextBtn.style.display = isLastSlide ? 'none' : 'inline-block';
        dotsContainer.style.display = isLastSlide ? 'none' : 'flex';
    }

    nextBtn.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateOnboardingUI(); }});
    prevBtn.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateOnboardingUI(); }});
    
    // Botó de desar Token
    UI.saveApiKeyBtn.addEventListener('click', () => {
        console.log("Botó 'Desar Token' clicat!"); // Missatge de depuració
        const keyInput = UI.apiKeyInput.value.trim();
        if (keyInput.startsWith('hf_')) {
            localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
            alert("Clau API desada correctament!"); // Alerta visual per confirmar
            UI.showScreen('setup-screen');
        } else {
            alert("La clau de l'API no és vàlida. Ha de començar per 'hf_'.");
        }
    });
    
    // Altres botons principals
    UI.changeApiKeyBtn.addEventListener('click', () => {
        if (confirm("Vols esborrar la teva API Key?")) {
            localStorage.removeItem(API_KEY_STORAGE_ID);
            if (Director.isSessionActive) Director.aturarSessio();
            window.location.reload(); // Recarreguem per assegurar un estat net
        }
    });

    UI.startSessionBtn.addEventListener('click', async () => {
        const inspiracio = UI.masterInspirationInput.value;
        const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
        if (!apiKey) {
            UI.showScreen('api-key-screen');
            return;
        }
        await AudioManager.init();
        Director.init(apiKey, inspiracio);
    });

    // Botons de la sessió activa
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
        updateOnboardingUI(); // Assegurem que l'onboarding es mostra correctament
    }
});
