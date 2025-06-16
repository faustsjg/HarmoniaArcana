// FILE: assets/js/audioManager.js

export const AudioManager = {
    isInitialized: false,
    players: {},
    dmEffects: {},

    async init() {
        if (this.isInitialized) return;
        await Tone.start();
        Tone.Transport.start();
        
        this.dmEffects.distorsion = new Tone.Distortion(0).toDestination();
        this.dmEffects.pitchShift = new Tone.PitchShift(0).connect(this.dmEffects.distorsion);
        this.dmEffects.reverb = new Tone.Reverb({ decay: 1.5, wet: 0 }).connect(this.dmEffects.pitchShift);
        await this.dmEffects.reverb.generate();
        
        this.isInitialized = true;
        console.log("AudioManager Inicialitzat.");
    },

    async carregarPistes(pistes) {
        this.aturarTot();
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                if (this.players[key]) this.players[key].dispose();
                this.players[key] = new Tone.Player({
                    url: pistes[key],
                    loop: true,
                    onload: resolve,
                    onerror: (err) => { console.error(`Error carregant pista ${key}:`, err); resolve(); }
                }).connect(this.dmEffects.reverb);
            });
        });
        await Promise.all(loadingPromises);
        console.log("AudioManager: Pistes carregades.");
    },

    reproduirTot() {
        const ara = Tone.now() + 0.1;
        Object.values(this.players).forEach(player => player.start(ara));
    },
    
    aturarTot(tempsFadeOut = 1) {
        Object.values(this.players).forEach(player => {
            try {
                if (player.state === "started") player.stop(`+${tempsFadeOut}`);
            } catch (e) {}
        });
    },

    triggerDMEffect(effectType) {
        if (!this.isInitialized) return;
        const ara = Tone.now();
        switch (effectType) {
            case 'critical-hit':
                this.dmEffects.distorsion.distortion = 0.7;
                this.dmEffects.pitchShift.pitch = -4;
                Tone.Transport.scheduleOnce(() => {
                    this.dmEffects.distorsion.distortion = 0;
                    this.dmEffects.pitchShift.pitch = 0;
                }, ara + 1.5);
                break;
            case 'discovery':
                this.dmEffects.reverb.wet.rampTo(0.7, 0.2, ara);
                Tone.Transport.scheduleOnce(() => {
                    this.dmEffects.reverb.wet.rampTo(0, 1, Tone.now());
                }, ara + 2);
                break;
            case 'fail':
                 this.dmEffects.pitchShift.pitch = -0.5;
                Tone.Transport.scheduleOnce(() => {
                    this.dmEffects.pitchShift.pitch = 0;
                }, ara + 1);
                break;
        }
    }
};
