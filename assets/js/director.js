import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Speech } from './speech.js';
import { AI } from './ai.js';

export const Director = {
  apiKey: null,
  contextActual: {},
  isSessionActive: false,
  tracksByMood: {},

  async init(apiKey, universe) {
    this.apiKey = apiKey;
    if (universe === 'jrpg') {
      const resp = await fetch(`assets/sounds/univers/jrpg/jrpg.json`);
      this.tracksByMood = await resp.json();
    }
    this.contextActual = {};
    AudioManager.init();
    UI.showScreen('session-screen');
  },

  async toggleListening() {
    if (!this.isSessionActive) {
      Speech.startListening();
      UI.toggleListeningBtn.textContent = 'Desactivar micròfon';
      this.isSessionActive = true;
      this.runLoop();
    } else {
      Speech.stopListening();
      UI.toggleListeningBtn.textContent = 'Activar micròfon';
      this.isSessionActive = false;
    }
  },

  runLoop() {
    if (!this.isSessionActive) return;
    setTimeout(async () => {
      const text = Speech.getAndClearBuffer();
      if (text.length > 25) {
        const moodObj = await AI.analisarContext(this.apiKey, text);
        if (moodObj?.mood && moodObj.mood !== this.contextActual.mood) {
          this.contextActual = moodObj;
          const list = this.tracksByMood[moodObj.mood];
          if (list && list.length > 0) {
            const choice = list[Math.floor(Math.random()*list.length)];
            AudioManager.playTrack(`assets/sounds/univers/jrpg/${choice}`, moodObj.mood);
          }
        }
      }
      this.runLoop();
    }, 15000);
  },

  toggleMusic() {
    AudioManager.toggleTrack();
  },

  endSession() {
    AudioManager.stopTrack();
    UI.showScreen('universe-selection-screen');
  },

  playEffect(effect) {
    AudioManager.playEffect(effect);
  }
};
