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

  async init(apiKey, universe) {
    this.apiKey = apiKey;
    this.isSessionActive = true;

    await AudioManager.init();

    if (universe && universe !== 'custom') {
      const res = await fetch(`assets/sounds/univers/${universe}/jrpg.json`);
      this.moodLibrary = await res.json();
    }

    UI.showScreen('session-screen');
    UI.updateStatus('Sessió iniciada. Prem Escoltar.');

    Speech.init(text => UI.updateTranscript(text));

    this.playRandomFromMood('tema');
  },

  playRandomFromMood(mood) {
    const arr = this.moodLibrary?.[mood] || [];
    if (arr.length) {
      const choice = arr[Math.floor(Math.random() * arr.length)];
      AudioManager.playTrack(`assets/sounds/univers/jrpg/${choice}`, mood);
      UI.addLogEntry(`Reproduint ${choice}`);
    }
  },

  toggleListening() {
    if (!this.isSessionActive) return;
    if (Speech.isListening) {
      Speech.stopListening();
      UI.updateStatus('Mic inactiu');
      clearInterval(this.intervalId);
    } else {
      Speech.startListening();
      UI.updateStatus('Escoltant...');
      this.startAnalysisLoop();
    }
  },

  startAnalysisLoop() {
    this.intervalId = setInterval(async () => {
      const buffer = Speech.getAndClearBuffer();
      if (buffer.length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
      const ctx = await AI.analisarContext(this.apiKey, buffer);
      if (ctx?.mood) this.playRandomFromMood(ctx.mood);
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  toggleMusic() {
    AudioManager.toggleTrack();
  },

  endSession() {
    if (!this.isSessionActive) return;
    this.isSessionActive = false;

    Speech.stopListening();
    clearInterval(this.intervalId);
    AudioManager.stopTrack();

    UI.showScreen('universe-selection-screen');
    UI.updateStatus('Sessió finalitzada.');
  },

  playEffect(id) {
    AudioManager.playEffect(id);
    UI.addLogEntry(`Efecte: ${id}`);
  }
};
