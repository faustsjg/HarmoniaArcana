import { DIRECTOR_CONFIG } from './config.js';
import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

const defaultSounds = {
  jrpg: {
    inici: { url:'./assets/sounds/tema_principal.mp3',name:'Tema Principal' },
    combat: { url:'./assets/sounds/combat.mp3',name:'Combat' },
    calma: { url:'./assets/sounds/calma.mp3',name:'Calma' },
    misteri: { url:'./assets/sounds/misteri.mp3',name:'Misteri' },
  },
  horror: {
    inici: { url:'./assets/sounds/horror_tema.mp3',name:'Tema Horror' },
    combat: { url:'./assets/sounds/horror_combat.mp3',name:'Combat Horror' },
    calma: { url:'./assets/sounds/horror_calma.mp3',name:'Calma Horror' },
    misteri: { url:'./assets/sounds/horror_misteri.mp3',name:'Misteri Horror' },
  }
};

export const Director = {
  apiKey:null, isActive:false, context:{ mood:'inici' },
  userSounds:{}, intervalId:null, fullTranscript:"",

  setUniversePredefinit(universe) {
    if (!defaultSounds[universe]) return;
    this.userSounds = defaultSounds[universe];
    UI.addLogEntry(`Univers predefinit: ${universe}`);
  },

  setUniverseCustom(files) {
    this.userSounds = {};
    Object.entries(files).forEach(([mood,file]) => {
      if (file) this.userSounds[mood] = { url: URL.createObjectURL(file), name: file.name };
    });
    UI.addLogEntry("Univers personalitzat carregat");
  },

  async init(apiKey) {
    if (this.isActive) return;
    this.apiKey = apiKey;
    this.isActive = true;
    UI.showScreen('session-screen');
    UI.updateStatus("Fes clic a Escoltar per començar");
    UI.addLogEntry("Sessió iniciada");
    Speech.init(text => { this.fullTranscript = text; UI.updateTranscript(text); });
    this.reproduirPerContext({ mood:'inici' });
  },

  reproduirPerContext(ctx) {
    const p = this.userSounds[ctx.mood] || this.userSounds.inici;
    if (!p || p.url === AudioManager.currentTrackUrl) return;
    this.context = ctx;
    AudioManager.play(p.url, p.name);
  },

  toggleListening() {
    if (!this.isActive) return;
    if (Speech.isListening) {
      Speech.stopListening(); UI.toggleListeningBtnState(false);
      UI.updateStatus("Escolta aturada"); UI.addLogEntry("Escolta aturada");
      clearInterval(this.intervalId);
    } else {
      Speech.startListening(); UI.toggleListeningBtnState(true);
      UI.updateStatus("Escoltant..."); UI.addLogEntry("Escoltant...");
      this.iniciarAnalisi();
    }
  },

  iniciarAnalisi() {
    this.intervalId = setInterval(async () => {
      if (!this.isActive || !Speech.isListening) return;
      const buf = Speech.getAndClearBuffer();
      if (buf.trim().length < DIRECTOR_CONFIG.minCharsForAnalysis) return;
      const res = await AI.analitzar(this.apiKey, buf);
      if (res?.mood && res.mood !== this.context.mood) {
        UI.addLogEntry(`Mood canviat: ${res.mood}`);
        this.reproduirPerContext(res);
      }
    }, DIRECTOR_CONFIG.analysisInterval);
  },

  stopMusic() { AudioManager.stopAll(0.5); UI.addLogEntry("Música aturada"); },

  endSession() {
    this.isActive = false; clearInterval(this.intervalId);
    Speech.stopListening(); AudioManager.stopAll(0.5);
    UI.updateStatus("Sessió finalitzada"); UI.addLogEntry("Sessió finalitzada");
    UI.showScreen('universe-selection-screen');
  }
};
