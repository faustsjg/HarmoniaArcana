import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { Director } from './director.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init(APP_VERSION);

  // LANDING
  if (UI.landingStartBtn) {
    UI.landingStartBtn.addEventListener('click', () => {
      UI.showScreen('carousel-screen');
    });
  }

  // DESAR TOKEN
  if (UI.saveApiKeyBtn) {
    UI.saveApiKeyBtn.addEventListener('click', () => {
      const key = UI.apiKeyInput?.value.trim();
      if (!key?.startsWith('hf_')) return alert("Clau d'API no vàlida");
      localStorage.setItem(API_KEY_STORAGE_ID, key);
      UI.showScreen('universe-selection-screen');
    });
  }

  // CANVIAR TOKEN
  if (UI.changeApiKeyBtn) {
    UI.changeApiKeyBtn.addEventListener('click', () => {
      localStorage.removeItem(API_KEY_STORAGE_ID);
      UI.showScreen('carousel-screen');
    });
  }

  // SELECCIÓ UNIVERS
  document.querySelectorAll('.universe-card').forEach(card => {
    card.addEventListener('click', async () => {
      const selected = card.dataset.universe;
      const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
      if (!apiKey) return UI.showScreen('carousel-screen');

      if (selected === 'custom') {
        UI.showScreen('upload-screen');
      } else {
        await Director.init(apiKey, selected); // Passa el nom de l'univers
      }
    });
  });

  // FITXERS PROPIS
  if (UI.uploadDoneBtn) {
    UI.uploadDoneBtn.addEventListener('click', () => {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
      if (!apiKey) return UI.showScreen('carousel-screen');
      Director.init(apiKey, 'custom');
    });
  }

  // BOTÓ ESCOLTAR
  if (UI.toggleListeningBtn) {
    UI.toggleListeningBtn.addEventListener('click', () => {
      Director.toggleListening();
    });
  }

  // BOTÓ ATURA / REPRÈN MÚSICA
  if (UI.stopMusicBtn) {
    UI.stopMusicBtn.addEventListener('click', () => {
      Director.toggleMusic();
    });
  }

  // BOTÓ FINALITZAR
  if (UI.stopSessionBtn) {
    UI.stopSessionBtn.addEventListener('click', () => {
      Director.endSession();
    });
  }

  // BOTONS D’EFECTES DE SO
  document.querySelectorAll('[id^=sound-]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.id.replace('sound-', '');
      Director.playEffect(id);
    });
  });

  // COMENÇAR segons si hi ha API guardada
  const token = localStorage.getItem(API_KEY_STORAGE_ID);
  if (token) {
    UI.showScreen('universe-selection-screen');
  } else {
    UI.showScreen('landing-screen');
  }
});
