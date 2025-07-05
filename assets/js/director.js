import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

export const Director = {
  apiKey: null,
  isSessionActive: false,
  moodLibrary: {},
  intervalId: null,
  currentMood: null,

  async init(apiKey, universe) {
    this.apiKey = apiKey;
    this.isSessionActive = true;
    this.currentMood = null;

    await AudioManager.init();

    if (universe !== 'custom') {
      const response = await fetch(`assets/sounds/univers/${universe}/jrpg.json`);
      this.moodLibrary = await response.json();
    } else {
      // Lògica per univers personalitzat podria anar aquí
      this.moodLibrary = {
        tema: [],
        combat: [],
        calma: [],
        misteri: []
      };
    }

    UI.showScreen('session-screen');
    UI.updateStatus('Sessió iniciada. Prem "Escoltar" per començar.');
    UI.updateTranscript('');
    Speech.init(text => UI.updateTranscript(text));
    this.playTrackForMood('tema');
  },

  playTrackForMood(mood) {
    const options = this.moodLibrary[mood];
    if (!options || options.length === 0) {
      console.warn(`No hi ha pistes per al mood: ${mood}`);
      return;
    }

    const next = options[Math.floor(Math.random() * options.length)];
    const url = `assets/sounds/univers/jrpg/${next}`;
    AudioManager.playTrack(url, mood);
    this.currentMood = mood;
    UI.addLogEntry(`🎵 Canvi a mood: ${mood}`);
  },

  toggleListening() {
    if (!this.isSessionActive) return;

    const isActive = Speech.isListening;
    if (isActive) {
      Speech.stopListening();
      clearInterval(this.intervalId);
      UI.updateStatus('Micròfon aturat');
    } else {
      Speech.startListening();
      UI.updateStatus('🎙️ Escoltant...');
      this.analysisLoop();
    }
  },

  analysisLoop() {
    this.intervalId = setInterval(async () => {
      if (!this.isSessionActive || !Speech.isListening) return;

      const text = Speech.getAndClearBuffer();
      if (text.length < DIRECTOR_CONFIG.minCharsForAnalysis) return;

      const result = await AI.analisarContext(this.apiKey, text);
      if (result && result.mood && result.mood !== this.currentMood) {
        if (this.moodLibrary[result.mood]) {
          this.playTrackForMood(result.mood);
        } else {
          console.warn(`Mood rebut desconegut: ${result.mood}`);
        }
      }
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  toggleMusic() {
    AudioManager.toggleTrack();
  },

  endSession() {
    if (!this.isSessionActive) return;

    this.isSessionActive = false;
    clearInterval(this.intervalId);
    Speech.stopListening();
    AudioManager.stopTrack();

    UI.showScreen('universe-selection-screen');
    UI.updateStatus('Sessió finalitzada.');
    UI.addLogEntry('Sessió tancada');
  },

  playEffect(id) {
    AudioManager.playEffect(id);
    UI.addLogEntry(`🔊 Efecte reproduït: ${id}`);
  }
};