import { UI } from './ui.js';
import { AI } from './ai.js';
import { Speech } from './speech.js';
import { AudioManager } from './audioManager.js';

const soundMap = { tema:[], combat:[], calma:[], misteri:[], tensio:[], social:[], boss:[], emocional:[], triomf:[] };

export const Director = {
  apiKey:null, mood:null, isActive:false, intervalId:null,
  async init(key, universe) {
    this.apiKey = key; this.isActive = true;
    await AudioManager.init();
    if (universe==='jrpg') {
      const m = await fetch('assets/sounds/univers/jrpg.json').then(r=>r.json());
      Object.assign(soundMap, m);
    }
    UI.showScreen('session-screen');
    UI.addLogEntry('Sessió iniciada');
    Speech.startListening();
    this.mood='tema';
    this.playMood(this.mood);
    this.intervalId = setInterval(()=>this.doAnalysis(),15000);
  },
  async doAnalysis() {
    const txt = Speech.getAndClearBuffer();
    if (txt.length < 25) return;
    const res = await AI.analisarContext(this.apiKey, txt);
    if (res?.mood && res.mood !== this.mood && soundMap[res.mood]?.length) {
      this.playMood(res.mood);
    }
  },
  playMood(mood) {
    this.mood = mood;
    const arr = soundMap[mood];
    const choice = arr[Math.floor(Math.random()*arr.length)];
    AudioManager.playTrack(`assets/sounds/univers/jrpg/${choice}`, mood);
    UI.updateMusicStatus(true, mood);
    UI.addLogEntry(`Mood: ${mood}`);
  },
  toggleListening() {
    if (!this.isActive) return;
    Speech.isListening ? Speech.stopListening() : Speech.startListening();
    UI.toggleListeningBtn.classList.toggle('active');
  },
  toggleMusic() {
    AudioManager.toggleTrack();
    UI.stopMusicBtn.classList.toggle('active');
  },
  playEffect(id) {
    AudioManager.playEffect(id);
    UI.addLogEntry(`Efecte: ${id}`);
  },
  endSession() {
    this.isActive = false;
    clearInterval(this.intervalId);
    Speech.stopListening();
    AudioManager.stopTrack();
    UI.showScreen('universe-selection-screen');
    UI.addLogEntry('Sessió finalitzada');
  }
};
