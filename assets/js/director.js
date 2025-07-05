import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
  apiKey: null,
  isSessionActive: false,
  moodLibrary: null,
  intervalId: null,

  async init(apiKey) {
    this.apiKey = apiKey;
    this.isSessionActive = true;
    UI.showScreen('session-screen');
    await AudioManager.init();

    // Load mood library
    const res = await fetch('assets/sounds/univers/jrpg/jrpg.json');
    this.moodLibrary = await res.json();

    // Play theme
    this.playRandomFromMood('tema');

    UI.updateStatus("Prem 'Escoltar' per començar");
    Speech.init(text => UI.updateTranscript(text));
  },

  playRandomFromMood(mood) {
    const arr = this.moodLibrary?.[mood];
    if (!arr || arr.length === 0) return;
    const choice = arr[Math.floor(Math.random() * arr.length)];
    AudioManager.playTrack(`assets/sounds/univers/jrpg/${choice}`, mood);
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

  startAnalysisLoop() {
    this.intervalId = setInterval(async () => {
      const buffer = Speech.getAndClearBuffer();
      if (buffer.length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
      const ctx = await AI.analisarContext(this.apiKey, buffer);
      if (ctx?.mood) {
        this.playRandomFromMood(ctx.mood);
        UI.addLogEntry(`Mood detectat: ${ctx.mood}`);
      }
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  toggleMusic() {
    AudioManager.stopTrack();
  },

  endSession() {
    if (!this.isSessionActive) return;
    this.isSessionActive = false;
    clearInterval(this.intervalId);
    Speech.stopListening();
    AudioManager.stopTrack();
    UI.showScreen('universe-selection-screen');
    UI.updateStatus("Sessió finalitzada.");
  },

  playEffect(id) {
    AudioManager.playEffect(id);
    UI.addLogEntry(`🔊 efecte: ${id}`);
  }
};