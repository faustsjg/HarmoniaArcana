import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init(APP_VERSION);
  UI.showScreen('landing-screen');

  UI.landingStartBtn?.addEventListener('click', () => {
    if (!localStorage.getItem(API_KEY_STORAGE_ID)) UI.showScreen('carousel-screen');
    else UI.showScreen('universe-selection-screen');
  });

  UI.saveApiKeyBtn?.addEventListener('click', () => {
    const key = UI.apiKeyInput.value.trim();
    if (!key.startsWith('hf_')) return alert("Token invàlid");
    localStorage.setItem(API_KEY_STORAGE_ID, key);
    UI.showScreen('universe-selection-screen');
  });

  UI.backToLandingBtn?.addEventListener('click', () => UI.showScreen('landing-screen'));

  document.querySelectorAll('[data-universe]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.universe;
      if (type === 'custom') UI.showScreen('upload-screen');
      else {
        Director.setUniversePredefinit(type);
        AudioManager.init().then(() => Director.init(localStorage.getItem(API_KEY_STORAGE_ID)));
      }
    });
  });

  UI.uploadDoneBtn?.addEventListener('click', () => {
    Director.setUniverseCustom({
      combat: UI.uploadCombat.files[0],
      calma: UI.uploadCalma.files[0],
      misteri: UI.uploadMisteri.files[0],
    });
    AudioManager.init().then(() => Director.init(localStorage.getItem(API_KEY_STORAGE_ID)));
  });

  UI.toggleListeningBtn?.addEventListener('click', () => Director.toggleListening());
  UI.stopMusicBtn?.addEventListener('click', () => Director.toggleMusic());
  UI.stopSessionBtn?.addEventListener('click', () => {
    Director.endSession();
    UI.showScreen('universe-selection-screen');
  });
});
