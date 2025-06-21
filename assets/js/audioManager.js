// FILE: assets/js/audioManager.js
export const AudioManager = {
    isInitialized: false,
    players: {},

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            Tone.Transport.start();
            this.isInitialized = true;
            console.log("AudioManager Inicialitzat CORRECTAMENT.");
        } catch (error) {
            console.error("Error inicialitzant l'AudioManager:", error);
        }
    },

    async carregarPistes(pistes) {
        if (!this.isInitialized) return;
        this.aturarTot(0.1);
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                if (this.players[key]) this.players[key].dispose();
                this.players[key] = new Tone.Player({
                    url: pistes[key],
                    loop: true,
                    onload: resolve,
                    onerror: (err) => { console.error(`Error carregant pista ${key}:`, err); resolve(); }
                }).toDestination();
            });
        });
        await Promise.all(loadingPromises);
    },

    reproduirTot() {
        if (!this.isInitialized || Object.keys(this.players).length === 0) return;
        console.log("AudioManager: Reproduint totes les capes.");
        const ara = Tone.now() + 0.1;
        Object.values(this.players).forEach(player => player.start(ara));
    },
    
    aturarTot(tempsFadeOut = 1) {
        if (!this.isInitialized) return;
        console.log("AudioManager: Aturant totes les capes.");
        Object.values(this.players).forEach(player => {
            if (player && player.state === "started") {
                player.volume.rampTo(-Infinity, tempsFadeOut);
                // Aturem i netegem després del fade-out
                player.stop(`+${tempsFadeOut + 0.1}`);
            }
        });
        // Important: No eliminem els objectes player aquí per si només és una pausa.
        // La neteja es farà en carregar noves pistes.
    },

    playSoundEffect(soundFile) {
        if (!this.isInitialized) return;
        const soundUrl = `assets/sounds/${soundFile}`;
        try {
            const player = new Tone.Player(soundUrl).toDestination();
            player.autostart = true;
            player.onstop = () => player.dispose();
        } catch (error) {
            console.error(`Error reproduint l'efecte de so: ${soundFile}`, error);
        }
    }
};
