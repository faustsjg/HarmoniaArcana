// FILE: assets/js/audioManager.js
export const AudioManager = {
    isInitialized: false,
    aiMusicPlayers: {},
    standbyPlayer: null,

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            Tone.Transport.start();
            this.isInitialized = true;
        } catch (error) { console.error("Error inicialitzant l'AudioManager:", error); }
    },

    playStandbyMusic() {
        if (!this.isInitialized || this.standbyPlayer) return;
        // Assegura't que tens aquest fitxer a la teva carpeta assets/sounds/
        const standbyUrl = 'assets/sounds/standby-music.mp3'; 
        this.standbyPlayer = new Tone.Player({
            url: standbyUrl,
            loop: true,
            volume: -12,
            fadeIn: 2,
        }).toDestination();
        this.standbyPlayer.autostart = true;
    },

    stopStandbyMusic(fadeOutTime = 2) {
        if (this.standbyPlayer && this.standbyPlayer.state === "started") {
            this.standbyPlayer.volume.rampTo(-Infinity, fadeOutTime);
            this.standbyPlayer.stop(`+${fadeOutTime}`);
        }
    },

    async carregarPistes(pistes) {
        if (!this.isInitialized) return;
        this.stopStandbyMusic(1); // Aturem la música d'espera amb un fade-out
        this.aturarTot(0.1);
        
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                this.aiMusicPlayers[key] = new Tone.Player({
                    url: pistes[key],
                    loop: true,
                    fadeIn: 2, // Afegim un fade-in suau
                    onload: resolve,
                }).toDestination();
            });
        });
        await Promise.all(loadingPromises);
    },

    reproduirTot() {
        if (!this.isInitialized || Object.keys(this.aiMusicPlayers).length === 0) return;
        const ara = Tone.now() + 0.1;
        Object.values(this.aiMusicPlayers).forEach(player => player.start(ara));
    },
    
    aturarTot(tempsFadeOut = 1) {
        if (!this.isInitialized) return;
        Object.values(this.aiMusicPlayers).forEach(player => {
            if (player && player.state === "started") {
                player.volume.rampTo(-Infinity, tempsFadeOut);
                player.stop(`+${tempsFadeOut + 0.1}`);
            }
        });
    },

    playSoundEffect(soundFile) {
        if (!this.isInitialized) return;
        const soundUrl = `assets/sounds/${soundFile}`;
        try {
            const player = new Tone.Player(soundUrl).toDestination();
            player.autostart = true;
            player.onstop = () => player.dispose();
        } catch (error) { console.error(`Error reproduint so: ${soundFile}`, error); }
    }
};
