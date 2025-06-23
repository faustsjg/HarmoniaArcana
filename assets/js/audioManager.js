// FILE: assets/js/audioManager.js
export const AudioManager = {
    isInitialized: false,
    aiMusicPlayers: {}, // Canviem el nom per a més claredat
    standbyPlayer: null,

    async init() { /* ... */ },

    // NOU: Funció per a la música d'espera
    playStandbyMusic() {
        if (!this.isInitialized) return;
        const standbyUrl = 'assets/sounds/standby-music.mp3'; // HAS DE TENIR AQUEST FITXER
        this.standbyPlayer = new Tone.Player({
            url: standbyUrl,
            loop: true,
            volume: -10, // Volum més baix que la música principal
            fadeIn: 1,
        }).toDestination();
        this.standbyPlayer.autostart = true;
    },

    stopStandbyMusic(fadeOutTime = 1) {
        if (this.standbyPlayer && this.standbyPlayer.state === "started") {
            this.standbyPlayer.volume.rampTo(-Infinity, fadeOutTime);
            this.standbyPlayer.stop(`+${fadeOutTime}`);
        }
    },

    async carregarPistes(pistes) {
        if (!this.isInitialized) return;
        this.stopStandbyMusic(); // Aturem la música d'espera
        this.aturarTot(0.1);
        // ... (la resta de la funció es manté igual, però utilitza this.aiMusicPlayers)
    },
    
    // ... (la resta de funcions es mantenen igual, però utilitzen this.aiMusicPlayers)
};
