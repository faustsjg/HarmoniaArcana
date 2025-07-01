import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

const defaultSounds = {
  inici:{url:'./assets/sounds/tema_principal.mp3',name:'Tema Principal'},
  combat:{url:'./assets/sounds/tema_combat.mp3',name:'Combat'},
  calma:{url:'./assets/sounds/tema_calma.mp3',name:'Calma'},
  misteri:{url:'./assets/sounds/tema_misteri.mp3',name:'Misteri'},
  default:{url:'./assets/sounds/tema_principal.mp3',name:'Tema Principal'}
};

export const Director = {
  apiKey:null, isActive:false, context:{mood:'inici'},
  userSounds:{}, intervalId:null, fullTranscript:'',

  async init(apiKey) {
    this.apiKey=apiKey;
    this.isActive=true;
    UI.showScreen('session-screen');
    UI.updateStatus("Fes clic a Escoltar per començar");
    UI.addLogEntry("Sessió iniciada");
    Speech.init(text => {
      this.fullTranscript=text;
      UI.updateTranscript(text);
    });
    this.changeMusic({mood:'inici'});
  },

  changeMusic(ctx) {
    const mood = ctx.mood;
    const snd = this.userSounds[mood] || defaultSounds[mood] || defaultSounds.default;
    if (snd.url === AudioManager.currentTrackUrl) return;
    this.context = ctx;
    UI.addLogEntry(`Nova música per mood: <strong>${mood}</strong>`);
    AudioManager.play(snd.url, snd.name);
  },

  toggleListening() {
    if (!this.isActive) return;
    const listening = Speech.isListening;
    if (listening) {
      Speech.stopListening();
      UI.setButtonActive(UI.toggleListeningBtn,false);
      UI.updateStatus("Escolta pausada");
      UI.addLogEntry("Escolta pausada");
      clearInterval(this.intervalId);
    } else {
      Speech.startListening();
      UI.setButtonActive(UI.toggleListeningBtn,true);
      UI.updateStatus("Escoltant...");
      UI.addLogEntry("Escolta activada");
      this.startLoop();
    }
  },

  startLoop() {
    this.intervalId = setInterval(async () => {
      if (!this.isActive || !Speech.isListening) return;
      const buf = Speech.getAndClearBuffer();
      if (buf.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
      const ctx = await AI.analitzar(this.apiKey, buf);
      ctx && ctx.mood && ctx.mood !== this.context.mood && this.changeMusic(ctx);
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  stopMusic() {
    if (!this.isActive) return;
    AudioManager.stopAll(0.5);
    UI.addLogEntry("Música aturada manualment");
  },

  endSession() {
    this.isActive=false;
    clearInterval(this.intervalId);
    Speech.stopListening();
    AudioManager.stopAll(0.5);
    UI.addLogEntry("Sessió finalitzada");
    UI.updateStatus("Sessió finalitzada");
    UI.showScreen('setup-screen');
  }
};
