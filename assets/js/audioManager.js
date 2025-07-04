import { UI } from './ui.js';
import * as Tone from 'tone';

export const AudioManager = {
  isInitialized: false,
  musicPlayer: null,
  currentTrackUrl: null,
  effects: {},

  async init() {
    if (this.isInitialized) return;
    await Tone.start();
    Tone.Transport.start();
    this.isInitialized = true;

    const effectIds = ['encanteri','espasa','llampec','misil','porta','rugit'];
    for (const id of effectIds) {
      this.effects[id] = new Tone.Player(`assets/sounds/${id}.mp3`).toDestination();
    }
  },

  playTrack(url, name) {
    if (!this.isInitialized) return;
    if (this.musicPlayer) this.musicPlayer.stop();
    this.musicPlayer = new Tone.Player(url).toDestination();
    this.musicPlayer.start();
    this.currentTrackUrl = url;
    UI.updateMusicStatus(true, name);
  },

  stopTrack() {
    if (this.musicPlayer) {
      this.musicPlayer.stop();
      this.currentTrackUrl = null;
      UI.updateMusicStatus(false);
    }
  },

  playEffect(id) {
    const player = this.effects[id];
    if (player) player.start();
  }
};
