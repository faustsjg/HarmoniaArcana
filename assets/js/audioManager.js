import * as Tone from 'tone';
import { UI } from './ui.js';

export const AudioManager = {
  player: null,
  effectPlayers: {},
  isPlaying: false,

  async init() {
    await Tone.start();
  },

  playTrack(url, name) {
    this.stopTrack();

    this.player = new Tone.Player({
      url,
      loop: true,
      autostart: true,
      onload: () => {
        this.isPlaying = true;
        UI.updateMusicStatus(true, name);
      },
      onerror: err => console.error(err)
    }).toDestination();
  },

  toggleTrack() {
    if (this.player) {
      if (this.isPlaying) {
        this.player.stop();
        this.isPlaying = false;
        UI.updateMusicStatus(false);
      } else {
        this.player.start();
        this.isPlaying = true;
        UI.updateMusicStatus(true);
      }
    }
  },

  stopTrack() {
    if (this.player) {
      this.player.stop();
      this.player.dispose();
      this.player = null;
      this.isPlaying = false;
      UI.updateMusicStatus(false);
    }
  },

  playEffect(id) {
    const url = `assets/sounds/effects/${id}.mp3`;
    const p = new Tone.Player({
      url,
      autostart: true,
      onload: () => {
        p.dispose();
      },
      onerror: err => console.error(err)
    }).toDestination();
    this.effectPlayers[id] = p;
  }
};
