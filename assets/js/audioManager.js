// FILE: assets/js/audioManager.js

export const AudioManager = {
    isInitialized: false,
    players: {},
    dmEffects: {},

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            this.dmEffects.distorsion = new Tone.Distortion(0).toDestination();
            this.dmEffects.pitchShift = new Tone.PitchShift(0).connect(this.dmEffects.distorsion);
            this.dmEffects.reverb = new Tone.Reverb({ decay: 1.5, wet: 0 });
            this.dmEffects.reverb.connect(this.dmEffects.pitchShift);
            await this.dmEffects.reverb.generate();
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
                    onerror: (err) => resolve()
                }).connect(this.dmEffects.reverb);
            });
        });
        await Promise.all(loadingPromises);
        console.log("AudioManager: Pistes carregades.");
    },

    reproduirTot() {
        if (!this.isInitialized) return;
        const ara = Tone.now() + 0.1;
        Object.values(this.players).forEach(player => player.start(ara));
    },
    
    aturarTot(tempsFadeOut = 1) {
        if (!this.isInitialized) return;
        Object.values(this.players).forEach(player => {
            if (player && player.state === "started") player.volume.rampTo(-Infinity, tempsFadeOut);
        });
        // Aturem i netegem després del fade-out
        setTimeout(() => {
            Object.values(this.players).forEach(player => player.stop().dispose());
            this.players = {};
        }, tempsFadeOut * 1000 + 100);
    },
    
    // NOU: Funció per reproduir efectes del soundboard
    playSoundEffect(soundFile) {
        if (!this.isInitialized) return;
        const soundUrl = `assets/sounds/${soundFile}`;
        const player = new Tone.Player(soundUrl).toDestination();
        player.autostart = true;
        player.onstop = () => player.dispose(); // Neteja la memòria
    },

    triggerDMEffect(effectType) {
        // ... (codi sense canvis)
    }
};
