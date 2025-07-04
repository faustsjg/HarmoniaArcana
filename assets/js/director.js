import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';
import { AI } from './ai.js';

const universPredefinit = {
  jrpg: {
    tema: [{ url: './assets/sounds/jrpg/tema.mp3', name: 'Tema Principal' }],
    combat: [
      { url: './assets/sounds/jrpg/combat1.mp3', name: 'Combat 1' },
      { url: './assets/sounds/jrpg/combat2.mp3', name: 'Combat 2' },
      { url: './assets/sounds/jrpg/combat3.mp3', name: 'Combat 3' },
      { url: './assets/sounds/jrpg/combat4.mp3', name: 'Combat 4' }
    ],
    boss: [
      { url: './assets/sounds/jrpg/boss1.mp3', name: 'Boss 1' },
      { url: './assets/sounds/jrpg/boss2.mp3', name: 'Boss 2' }
    ],
    exploracio: [
      { url: './assets/sounds/jrpg/exploracio1.mp3', name: 'Exploració 1' },
      { url: './assets/sounds/jrpg/exploracio2.mp3', name: 'Exploració 2' },
      { url: './assets/sounds/jrpg/exploracio3.mp3', name: 'Exploració 3' }
    ],
    calma: [
      { url: './assets/sounds/jrpg/calma1.mp3', name: 'Calma 1' },
      { url: './assets/sounds/jrpg/calma2.mp3', name: 'Calma 2' }
    ],
    social: [
      { url: './assets/sounds/jrpg/social1.mp3', name: 'Social 1' },
      { url: './assets/sounds/jrpg/social2.mp3', name: 'Social 2' },
      { url: './assets/sounds/jrpg/social3.mp3', name: 'Social 3' }
    ],
    misteri: [
      { url: './assets/sounds/jrpg/misteri1.mp3', name: 'Misteri 1' },
      { url: './assets/sounds/jrpg/misteri2.mp3', name: 'Misteri 2' },
      { url: './assets/sounds/jrpg/misteri3.mp3', name: 'Misteri 3' }
    ],
    tensio: [
      { url: './assets/sounds/jrpg/tensio1.mp3', name: 'Tensió 1' },
      { url: './assets/sounds/jrpg/tensio2.mp3', name: 'Tensió 2' },
      { url: './assets/sounds/jrpg/tensio3.mp3', name: 'Tensió 3' }
    ],
    emocional: [
      { url: './assets/sounds/jrpg/emocional1.mp3', name: 'Emocional 1' },
      { url: './assets/sounds/jrpg/emocional2.mp3', name: 'Emocional 2' },
      { url: './assets/sounds/jrpg/emocional3.mp3', name: 'Emocional 3' }
    ],
    triumf: [
      { url: './assets/sounds/jrpg/triumf1.mp3', name: 'Triumf 1' },
      { url: './assets/sounds/jrpg/triumf2.mp3', name: 'Triumf 2' }
    ]
  }
};

const lastPlayed = {};

function triarPista(pistas) {
  if (!pistas || pistas.length === 0) return null;
  const prev = lastPlayed[pistas[0].name.split(' ')[0].toLowerCase()];
  let opts = pistas;
  if (pistas.length > 1 && prev) opts = pistas.filter(p => p.url !== prev.url);
  const sel = opts[Math.floor(Math.random() * opts.length)];
  lastPlayed[pistas[0].name.split(' ')[0].toLowerCase()] = sel;
  return sel;
}

export const Director = {
  currentUniverse: null,
  contextActual: { mood: 'tema' },
  isSessionActive: false,
  intervalId: null,
  fullTranscript: "",

  setUniversePredefinit(name) {
    this.currentUniverse = universPredefinit[name];
  },

  async init(apiKey) {
    if (this.isSessionActive) return;
    this.isSessionActive = true;
    UI.showScreen('session-screen');
    UI.updateStatus("Fes click 'Escoltar' per començar.");
    UI.updateMusicStatus(false);
    UI.updateTranscript("");
    this.fullTranscript = "";

    Speech.init(text => {
      this.fullTranscript = text;
      UI.updateTranscript(text);
    });

    const tema = triarPista(this.currentUniverse.tema);
    AudioManager.init().then(() => {
      if (tema) AudioManager.reproduirPista(tema.url, tema.name);
    });
  },

  toggleListening() {
    if (!this.isSessionActive) return;
    Speech.isListening ? Speech.stopListening() : Speech.startListening();
    UI.toggleListeningBtnState(Speech.isListening);
    if (Speech.isListening) this.startAnalysisLoop();
  },

  startAnalysisLoop() {
    this.intervalId = setInterval(async () => {
      const text = Speech.getAndClearBuffer();
      if (text.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
      const ctx = await AI.analisarContext(localStorage.getItem(API_KEY_STORAGE_ID), text);
      if (ctx?.mood && ctx.mood !== this.contextActual.mood) {
        this.contextActual = ctx;
        const pista = triarPista(this.currentUniverse[ctx.mood]);
        if (pista) AudioManager.reproduirPista(pista.url, pista.name);
      }
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  toggleMusic() {
    if (!this.isSessionActive) return;
    AudioManager.player?.state === 'started' ? AudioManager.aturarTot() : AudioManager.player.start();
  },

  endSession() {
    if (!this.isSessionActive) return;
    this.isSessionActive = false;
    clearInterval(this.intervalId);
    Speech.stopListening();
    AudioManager.aturarTot(0);
    UI.showScreen('universe-selection-screen');
    UI.updateStatus("Sessió finalitzada.");
  }
};
