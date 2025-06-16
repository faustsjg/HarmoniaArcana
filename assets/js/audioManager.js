// FILE: assets/js/audioManager.js

export const AudioManager = {
    isInitialized: false,
    players: {}, // Emmagatzema els objectes Tone.Player per a cada capa.
    dmEffects: {}, // Emmagatzema les instàncies dels efectes manuals.

    // Inicialitza Tone.js. S'ha de cridar després d'una interacció de l'usuari.
    async init() {
        if (this.isInitialized) return;
        await Tone.start();
        Tone.Transport.start();
        
        // Creem els efectes manuals del DM per endavant.
        this.dmEffects.distorsion = new Tone.Distortion(0).toDestination();
        this.dmEffects.pitchShift = new Tone.PitchShift(0).connect(this.dmEffects.distorsion);
        this.dmEffects.reverb = new Tone.Reverb({ decay: 1.5, wet: 0 }).connect(this.dmEffects.pitchShift);
        await this.dmEffects.reverb.generate(); // Pre-calculem la reverb per a un millor rendiment.
        
        this.isInitialized = true;
        console.log("AudioManager Inicialitzat. Context d'àudio llest.");
    },

    // Carrega un conjunt de pistes (stems) i les prepara per a la reproducció.
    async carregarPistes(pistes) {
        console.log("AudioManager: Carregant pistes...", pistes);
        this.aturarTot();
        
        // Esperem que totes les pistes es carreguin abans de continuar.
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                // Si ja existia un player per a aquesta capa, el netegem abans.
                if (this.players[key]) {
                    this.players[key].dispose();
                }
                this.players[key] = new Tone.Player({
                    url: pistes[key],
                    loop: true,
                    onload: resolve,
                    onerror: (err) => { console.error(`Error carregant la pista ${key}:`, err); resolve(); }
                }).connect(this.dmEffects.reverb); // Connectem cada player a la cadena d'efectes.
            });
        });
        
        await Promise.all(loadingPromises);
        console.log("AudioManager: Pistes carregades.");
    },

    // Reprodueix totes les capes carregades de manera sincronitzada.
    reproduirTot() {
        console.log("AudioManager: Reproduint totes les capes.");
        const ara = Tone.now() + 0.1; // Un petit buffer per assegurar la sincronització
        Object.values(this.players).forEach(player => player.start(ara));
    },
    
    // Atura totes les capes amb un suau fade-out.
    aturarTot(tempsFadeOut = 1) {
        console.log("AudioManager: Aturant totes les capes.");
        Object.values(this.players).forEach(player => {
            try {
                if (player.state === "started") {
                    player.stop(`+${tempsFadeOut}`);
                }
            } catch (e) {
                // Ignorem errors si el player ja s'ha aturat o eliminat.
            }
        });
    },

    // Activa un efecte manual del DM.
    triggerDMEffect(effectType) {
        if (!this.isInitialized) return;
        
        console.log(`AudioManager: Activant efecte DM: ${effectType}`);
        const ara = Tone.now();

        switch (effectType) {
            case 'critical-hit':
                this.dmEffects.distorsion.distortion = 0.7;
                this.dmEffects.pitchShift.pitch = -4;
                // Tornar a la normalitat després de 1.5 segons.
                Tone.Transport.scheduleOnce(() => {
                    this.dmEffects.distorsion.distortion = 0;
                    this.dmEffects.pitchShift.pitch = 0;
                }, ara + 1.5);
                break;
            case 'discovery':
                this.dmEffects.reverb.wet.rampTo(0.7, 0.2, ara);
                 // Tornar a la normalitat
                Tone.Transport.scheduleOnce(() => {
                    this.dmEffects.reverb.wet.rampTo(0, 1, Tone.now());
                }, ara + 2);
                break;
            case 'fail':
                 this.dmEffects.pitchShift.pitch = -0.5;
                 // Tornar a la normalitat
                Tone.Transport.scheduleOnce(() => {
                    this.dmEffects.pitchShift.pitch = 0;
                }, ara + 1);
                break;
        }
    }
};
