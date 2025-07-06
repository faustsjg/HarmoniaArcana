export const AudioManager = {
  isInitialized: false,
  player: null,
  effect: null,

  async init() {
    if (this.isInitialized) return;
    await Tone.start();
    Tone.Transport.start();
    this.isInitialized = true;
  },

  playTrack(url, moodName = '') {
    if (this.player) {
      // fade out
      this.player.volume.rampTo(-Infinity, 1);
      // stop/despose old after fade
      setTimeout(() => {
        this.player.stop();
        this.player.dispose();
      }, 1000);
    }

    this.player = new Tone.Player({
      url,
      loop: true,
      volume: -Infinity,
      autostart: true,
      onload: () => {
        this.player.volume.rampTo(0, 2);
      },
      onerror: err => console.error('Error track:', err)
    }).toDestination();
  },

  toggleTrack() {
    if (!this.player) return;
    if (this.player.state === 'started') {
      this.player.volume.rampTo(-Infinity, 1);
      setTimeout(() => this.player.stop(), 1000);
    } else {
      this.player.start();
      this.player.volume.rampTo(0, 1);
    }
  },

  stopTrack() {
    if (this.player) {
      this.player.volume.rampTo(-Infinity, 1);
      setTimeout(() => {
        this.player.stop();
        this.player.dispose();
        this.player = null;
      }, 1000);
    }
  },

  playEffect(id) {
    const url = `assets/sounds/${id}.mp3`;
    if (this.effect) {
      this.effect.stop();
      this.effect.dispose();
    }
    this.effect = new Tone.Player({
      url,
      volume: -6,
      autostart: true,
      onerror: err => console.error('Error effect:', err)
    }).toDestination();
  }
};
