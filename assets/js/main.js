import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init(APP_VERSION);

  UI.landingStartBtn.addEventListener('click', () => UI.showScreen('api-key-screen'));

  UI.saveApiKeyBtn.addEventListener('click', () => {
    const key = UI.apiKeyInput.value.trim();
    if (!key.startsWith('hf_')) return alert("Clau no vàlida");
    localStorage.setItem(API_KEY_STORAGE_ID,key);
    UI.showScreen('universe-selection-screen');
  });

  UI.universeSelectionScreen.querySelectorAll('button[data-universe]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('harmoniaUniverse', btn.dataset.universe);
      UI.showScreen('upload-screen');
    });
  });

  UI.uploadDoneBtn.addEventListener('click', () => {
    const moods = ['combat','calma','misteri'];
    moods.forEach(m => {
      const inp = UI[`upload${m.charAt(0).toUpperCase()+m.slice(1)}`];
      if (inp.files[0]) {
        const url = URL.createObjectURL(inp.files[0]);
        Director.userSounds[m] = { url, name: inp.files[0].name };
      }
    });
    UI.addLogEntry("Pistes personalitzades assignades");
    UI.showScreen('setup-screen');
  });

  UI.changeApiKeyBtn.addEventListener('click', () => {
    if (confirm("Esborrar clau API?")) {
      localStorage.removeItem(API_KEY_STORAGE_ID);
      window.location.reload();
    }
  });

  UI.startSessionBtn.addEventListener('click', async () => {
    const key = localStorage.getItem(API_KEY_STORAGE_ID);
    if (!key) return UI.showScreen('api-key-screen');
    await AudioManager.init();
    Director.init(key);
  });

  UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
  UI.stopMusicBtn.addEventListener('click', () => Director.stopMusic());
  UI.stopSessionBtn.addEventListener('click', () => Director.endSession());

  if (localStorage.getItem(API_KEY_STORAGE_ID)) {
    UI.showScreen('setup-screen');
  } else {
    UI.showScreen('landing-screen');
  }
});
