export const AudioManager = {
  isInit: false, player: null, effect: null,
  async init() {
    if (this.isInit) return;
    await Tone.start();
    Tone.Transport.start();
    this.isInit = true;
  },
  playTrack(url, moodName) {
    if (this.player) {
      this.player.stop(); this.player.dispose();
    }
    this.player = new Tone.Player({url, loop:true, volume:-Infinity, autostart:true})
      .toDestination();
    this.player.volume.rampTo(0, 2);
  },
  toggleTrack() {
    if (!this.player) return;
    this.player.state === 'started' ? this.player.stop() : this.player.start();
  },
  stopTrack() {
    if (this.player) {
      this.player.stop(); this.player.dispose();
      this.player = null;
    }
  },
  playEffect(id) {
    const url = `assets/sounds/${id}.mp3`;
    if (this.effect) { this.effect.stop(); this.effect.dispose(); }
    this.effect = new Tone.Player({url, volume:-6, autostart:true}).toDestination();
  }
};
