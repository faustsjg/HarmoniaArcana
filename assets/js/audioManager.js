import { UI } from './ui.js';

export const AudioManager = {
  initialized:false, player:null, currentTrackUrl:null,

  async init() {
    if (this.initialized) return;
    await Tone.start();
    Tone.Transport.start();
    this.initialized = true;
  },

  play(url, name) {
    if (!this.initialized) return;
    const fadeIn = 2, fadeOut = 1.5;
    if (this.player && this.player.state==="started") {
      this.player.volume.rampTo(-Infinity,fadeOut);
      this.player.stop(`+${fadeOut}`);
    }
    this.currentTrackUrl = url;
    this.player = new Tone.Player({
      url, loop:true, volume:-Infinity,
      onload: () => {
        this.player.start();
        this.player.volume.rampTo(0,fadeIn);
        UI.updateMusicStatus(true,name);
      },
      onerror: err => {
        UI.updateMusicStatus(false,`Error: ${name}`);
        console.error(err);
      }
    }).toDestination();
  },

  stopAll(fade=1) {
    if (this.player && this.player.state==="started") {
      this.player.volume.rampTo(-Infinity,fade);
      this.player.stop(`+${fade}`);
      this.currentTrackUrl = null;
      UI.updateMusicStatus(false);
    }
  }
};
