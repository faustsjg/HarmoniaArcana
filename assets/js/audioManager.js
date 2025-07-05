import { UI } from './ui.js';

export const AudioManager = {
  isInitialized: false,
  player: null,
  currentTrackUrl: null,
  currentEffect: null,

  async init() {
    if (this.isInitialized || !window.Tone) return;
    try {
      await Tone.start();
      Tone.Transport.start();
      this.isInitialized = true;
    } catch (error) {
      console.error("Error inicialitzant Tone.js:", error);
    }
  },

  playTrack(url, moodName = '') {
    if (!this.isInitialized || !window.Tone) return;

    if (this.player) {
      this.player.stop();
      this.player.dispose();
    }

    this.currentTrackUrl = url;
    this.player = new Tone.Player({
      url: url,
      loop: true,
      volume: -Infinity,
      autostart: true,
      onload: () => {
        this.player.volume.rampTo(0, 2);
        UI.updateMusicStatus(true, moodName);
      },
      onerror: err => {
        console.error("Error reproduint la pista:", err);
        UI.updateMusicStatus(false, "Error");
      }
    }).toDestination();
  },

  toggleTrack() {
    if (!this.isInitialized || !this.player) return;

    if (this.player.state === 'started') {
      this.player.stop();
      UI.updateMusicStatus(false);
    } else {
      this.player.start();
      UI.updateMusicStatus(true, 'Reproducció');
    }
  },

  stopTrack() {
    if (this.player) {
      this.player.stop();
      this.player.dispose();
      this.player = null;
      this.currentTrackUrl = null;
      UI.updateMusicStatus(false);
    }
  },

  playEffect(effectId) {
    const effectUrl = `assets/sounds/effects/${effectId}.mp3`;

    if (this.currentEffect) {
      this.currentEffect.stop();
      this.currentEffect.dispose();
    }

    this.currentEffect = new Tone.Player({
      url: effectUrl,
      volume: -6,
      autostart: true,
      onerror: err => console.error("Error efecte sonor:", err)
    }).toDestination();
  }
};