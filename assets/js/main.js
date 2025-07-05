import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init(APP_VERSION);

  UI.landingStartBtn?.addEventListener('click', () => {
    UI.landingStartBtn.classList.add('hidden');
    UI.showScreen('carousel-screen');
  });

  UI.saveApiKeyBtn?.addEventListener('click', async () => {
    const key = UI.apiKeyInput.value.trim();
    if (!key.startsWith('hf_')) return alert('Clau no vàlida');
    localStorage.setItem(API_KEY_STORAGE_ID, key);
    UI.showScreen('universe-selection-screen');
  });

  document.querySelectorAll('[data-universe]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
      if (!apiKey) return UI.showScreen('carousel-screen');
      if (btn.dataset.universe === 'custom') UI.showScreen('upload-screen');
      else await Director.init(apiKey);
    });
  });

  UI.uploadDoneBtn?.addEventListener('click', () => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
    Director.init(apiKey);
  });

  UI.toggleListeningBtn?.addEventListener('click', () => Director.toggleListening());
  UI.stopMusicBtn?.addEventListener('click', () => Director.toggleMusic());
  UI.stopSessionBtn?.addEventListener('click', () => Director.endSession());

  document.querySelectorAll('[id^=sound-]').forEach(btn => {
    btn.addEventListener('click', () => Director.playEffect(btn.id.replace('sound-', '')));
  });

  // Show landing by default
  UI.showScreen('landing-screen');
});