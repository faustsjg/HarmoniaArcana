import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init(APP_VERSION);

  // Pas 1: Landing
  UI.showScreen('landing-screen');
  UI.landingStartBtn.addEventListener('click', () => {
    if (!localStorage.getItem(API_KEY_STORAGE_ID)) {
      UI.showScreen('carousel-screen');
    } else {
      UI.showScreen('universe-selection-screen');
    }
  });

  // Pas 2: Carrusel + token
  UI.saveApiKeyBtn.addEventListener('click', () => {
    const key = UI.apiKeyInput.value.trim();
    if (!key.startsWith('hf_')) return alert("Token invàlid");
    localStorage.setItem(API_KEY_STORAGE_ID, key);
    UI.showScreen('universe-selection-screen');
  });

  // Pas 3: Selecció univers
  document.querySelectorAll('[data-universe]').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = btn.dataset.universe;
      if (u === 'custom') {
        UI.showScreen('upload-screen');
      } else {
        Director.setUniversePredefinit(u);
        UI.showScreen('session-screen');
      }
    });
  });

  // 3.b Upload
  UI.backUniversityBtn.addEventListener('click', () => UI.showScreen('universe-selection-screen'));
  UI.uploadDoneBtn.addEventListener('click', () => {
    Director.setUniverseCustom({
      combat: UI.uploadCombat.files[0],
      calma: UI.uploadCalma.files[0],
      misteri: UI.uploadMisteri.files[0]
    });
    UI.showScreen('session-screen');
  });

  // 3.a/3.b.a: Sessió
  UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
  UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
  UI.stopSessionBtn.addEventListener('click', () => {
    Director.endSession();
    UI.showScreen('universe-selection-screen');
  });
});
