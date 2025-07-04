import { APP_VERSION } from './config.js';
import { UI } from './ui.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init(APP_VERSION);

  UI.landingStartBtn?.addEventListener('click', () => UI.showScreen('carousel-screen'));

  UI.saveApiKeyBtn?.addEventListener('click', () => {
    const key = UI.apiKeyInput.value.trim();
    if (key.startsWith('hf_')) {
      localStorage.setItem('harmoniaArcana_huggingFaceApiKey', key);
      UI.showScreen('universe-selection-screen');
    } else {
      alert("Clau no vàlida");
    }
  });

  document.querySelectorAll('[data-universe]').forEach(btn => {
    btn.addEventListener('click', async e => {
      const apiKey = localStorage.getItem('harmoniaArcana_huggingFaceApiKey');
      if (btn.dataset.universe === 'custom') UI.showScreen('upload-screen');
      else await Director.init(apiKey);
    });
  });

  UI.uploadDoneBtn?.addEventListener('click', async () => {
    const apiKey = localStorage.getItem('harmoniaArcana_huggingFaceApiKey');
    await Director.init(apiKey);
  });

  UI.toggleListeningBtn?.addEventListener('click', () => Director.toggleListening());
  UI.stopMusicBtn?.addEventListener('click', () => Director.toggleMusic());
  UI.stopSessionBtn?.addEventListener('click', () => Director.endSession());

  document.querySelectorAll('[id^=sound-]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.id.replace('sound-', '');
      Director.playEffect(id);
    });
  });
});
