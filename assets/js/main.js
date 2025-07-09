import { API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { Director } from './director.js';

let carouselStep = 0;

document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  const token = localStorage.getItem(API_KEY_STORAGE_ID);
  if (token) {
    UI.showScreen('universe-selection-screen');
    UI.updateStatus('Clau API detectada');
  } else {
    UI.showScreen('landing-screen');
    UI.updateStatus('');
  }

  UI.carouselNext.onclick = () => {
    if (carouselStep < 2) {
      carouselStep++;
      updateCarouselSteps();
    }
  };
  UI.carouselPrev.onclick = () => {
    if (carouselStep > 0) {
      carouselStep--;
      updateCarouselSteps();
    }
  };
  UI.saveApiKeyBtn.onclick = () => {
    const k = UI.apiKeyInput.value.trim();
    if (k) {
      localStorage.setItem(API_KEY_STORAGE_ID, k);
      UI.updateStatus('Clau API detectada');
      UI.showScreen('universe-selection-screen');
    }
  };

  document.querySelectorAll('.universe-card').forEach(card => {
    card.onclick = () => {
      const uni = card.getAttribute('data-universe');
      Director.startSession(uni);
    };
  });

  UI.uploadDoneBtn.onclick = () => {
    Director.startSession('custom');
  };

  UI.toggleListeningBtn.onclick = () => {
    Director.toggleListening();
  };
  UI.stopMusicBtn.onclick = () => {
    Director.toggleMusic();
  };
  UI.stopSessionBtn.onclick = () => {
    Director.endSession();
  };
});

function updateCarouselSteps() {
  const steps = UI.carouselScreen.querySelectorAll('.carousel-step');
  steps.forEach((s, i) => s.classList.toggle('hidden', i !== carouselStep));
  UI.carouselPrev.style.visibility = carouselStep === 0 ? 'hidden' : 'visible';
  UI.carouselNext.style.visibility = carouselStep === steps.length - 1 ? 'hidden' : 'visible';
}