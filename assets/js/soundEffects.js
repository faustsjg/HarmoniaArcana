export const SoundEffects = {
  players: {},

  async play(name) {
    const filePath = `./assets/sounds/${name}.mp3`;
    if (!this.players[name]) {
      this.players[name] = new Tone.Player(filePath).toDestination();
      await this.players[name].load();
    }
    this.players[name].start();
  }
};
