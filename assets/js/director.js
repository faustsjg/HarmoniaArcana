import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
  apiKey: null,
  isSessionActive: false,
  intervalId: null,

  async init(apiKey) {
    this.apiKey = apiKey;
    this.isSessionActive = true;
    UI.showScreen('session-screen');
    await AudioManager.init();
    UI.updateStatus("Prem 'Escoltar' per començar");
    Speech.init(text => UI.updateTranscript(text));
  },

  toggleListening() {
    if (!this.isSessionActive) return;
    if (Speech.isListening) {
      Speech.stopListening();
    } else {
      Speech.startListening();
      this.startAnalysisLoop();
    }
  },

  toggleMusic() {
    if (!this.isSessionActive) return;
    const isActive = UI.stopMusicBtn.classList.toggle('active');
    const i = UI.stopMusicBtn.querySelector('i');
    const span = UI.stopMusicBtn.querySelector('span');
    if (i) i.className = isActive ? 'fas fa-play' : 'fas fa-stop';
    if (span) span.textContent = isActive ? 'Reprodueix' : 'Atura música';

    if (isActive) {
      AudioManager.stopTrack();
    } else {
      AudioManager.playTrack('./assets/sounds/tema_principal.mp3', 'Tema Principal');
    }
  },

  playEffect(id) {
    AudioManager.playEffect(id);
    UI.addLogEntry(`🔊 efecte: ${id}`);
  },

  async startAnalysisLoop() {
    this.intervalId = setInterval(async () => {
      const text = Speech.getAndClearBuffer();
      if (text.length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
      const context = await AI.analisarContext(this.apiKey, text);
      if (context?.mood) {
        const moodTrack = `assets/sounds/tema_${context.mood}.mp3`;
        AudioManager.playTrack(moodTrack, context.mood);
      }
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  endSession() {
    if (!this.isSessionActive) return;
    this.isSessionActive = false;
    if (this.intervalId) clearInterval(this.intervalId);
    Speech.stopListening();
    AudioManager.stopTrack();
    UI.showScreen('universe-selection-screen');
    UI.updateStatus("Sessió finalitzada.");
  }
};
