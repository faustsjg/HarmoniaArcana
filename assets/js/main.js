import { UI } from './ui.js';
import { Director } from './director.js';
import { API_KEY_STORAGE_ID } from './config.js';

let carouselIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  bindHandlers();
});

function bindHandlers() {
  UI.landingStartBtn.onclick = () => {
    const hasKey = !!localStorage.getItem(API_KEY_STORAGE_ID);
    if (hasKey) {
      UI.showScreen('universe-selection-screen');
    } else {
      carouselIndex = 0;
      updateCarousel(0);
      UI.showScreen('carousel-screen');
    }
  };

  UI.carouselPrev.onclick = () => {
    if (carouselIndex > 0) updateCarousel(--carouselIndex);
  };

  UI.carouselNext.onclick = () => {
    if (carouselIndex < 2) updateCarousel(++carouselIndex);
    else if (localStorage.getItem(API_KEY_STORAGE_ID)) {
      UI.showScreen('universe-selection-screen');
    }
  };

  UI.saveApiKeyBtn.onclick = () => {
    const key = UI.apiKeyInput.value.trim();
    if (!key.startsWith('hf_')) return alert('Clau no vàlida');
    localStorage.setItem(API_KEY_STORAGE_ID, key);
    UI.apiStatus.textContent = 'Clau API detectada';
    UI.apiStatus.style.color = '#10b981';
    UI.showScreen('universe-selection-screen');
  };

  UI.changeApiKeyBtn.onclick = () => {
    localStorage.removeItem(API_KEY_STORAGE_ID);
    UI.apiStatus.textContent = 'Sense clau API';
    UI.apiStatus.style.color = '#dc2626';
    carouselIndex = 0;
    updateCarousel(0);
    UI.showScreen('carousel-screen');
  };

  document.querySelectorAll('.universe-card').forEach(c => {
    c.onclick = () => {
      const uni = c.dataset.universe;
      const key = localStorage.getItem(API_KEY_STORAGE_ID);
      if (!key) return alert('Cal la clau API');
      if (uni === 'custom') return UI.showScreen('upload-screen');
      Director.init(key, uni);
    };
  });

  document.getElementById('upload-done-btn').onclick = () => {
    Director.init(localStorage.getItem(API_KEY_STORAGE_ID), 'custom');
  };

  // Botons sessions
  UI.toggleListeningBtn.onclick = () => Director.toggleListening();
  UI.stopMusicBtn.onclick = () => Director.toggleMusic();
  UI.stopSessionBtn.onclick = () => Director.endSession();

  document.querySelectorAll('#effect-buttons button').forEach(btn => {
    btn.onclick = () => Director.playEffect(btn.dataset.effect);
  });
}

function updateCarousel(i) {
  carouselIndex = i;
  document.querySelectorAll('.carousel-step').forEach((el, idx) => {
    el.classList.toggle('hidden', idx !== i);
  });
  document.getElementById('carousel-prev').style.visibility = i === 0 ? 'hidden' : 'visible';
  document.getElementById('carousel-next').textContent = i === 2 ? 'Finalitza' : 'Endavant';
}
