// FILE: assets/js/audioManager.js

export const AudioManager = {
    isInitialized: false,
    players: {},
    dmEffects: {},

    // Aquesta funció ARA SÍ que és l'únic punt d'entrada a Tone.js
    async init() {
        // Si ja està inicialitzat, no fem res.
        if (this.isInitialized) return;

        try {
            // 1. Demanem permís a l'usuari i iniciem el context d'àudio.
            await Tone.start();
            
            // 2. NOMÉS ARA creem tots els objectes de Tone.js.
            this.dmEffects.distorsion = new Tone.Distortion(0).toDestination();
            this.dmEffects.pitchShift = new Tone.PitchShift(0).connect(this.dmEffects.distorsion);
            this.dmEffects.reverb = new Tone.Reverb({ decay: 1.5, wet: 0 });
            
            // Connectem la cadena d'efectes. Reverb -> PitchShift -> Distorsion -> Sortida
            this.dmEffects.reverb.connect(this.dmEffects.pitchShift);
            await this.dmEffects.reverb.generate(); // Pre-calculem la reverb.
            
            // 3. Un cop tot està creat i connectat, iniciem el transport principal.
            Tone.Transport.start();
            
            this.isInitialized = true;
            console.log("AudioManager Inicialitzat CORRECTAMENT després del gest de l'usuari.");

        } catch (error) {
            console.error("Error inicialitzant l'AudioManager:", error);
            alert("No s'ha pogut inicialitzar el motor d'àudio. Si us plau, assegura't que el teu navegador té permisos per reproduir so.");
        }
    },

    // Aquesta funció ara ha de comprovar si estem inicialitzats.
    async carregarPistes(pistes) {
        if (!this.isInitialized) {
            console.error("AudioManager no inicialitzat. No es poden carregar pistes.");
            return;
        }
        
        console.log("AudioManager: Carregant pistes...", pistes);
        this.aturarTot(0); // Aturada instantània
        
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                if (this.players[key]) this.players[key].dispose();
                this.players[key] = new Tone.Player({
                    url: pistes[key],
                    loop: true,
                    onload: resolve,
                    onerror: (err) => { console.error(`Error carregant pista ${key}:`, err); resolve(); }
                // Connectem cada player a l'inici de la nostra cadena d'efectes.
                }).connect(this.dmEffects.reverb); 
            });
        });
        
        await Promise.all(loadingPromises);
        console.log("AudioManager: Pistes carregades.");
    },

    reproduirTot() {
        if (!this.isInitialized) return;
        console.log("AudioManager: Reproduint totes les capes.");
        const ara = Tone.now() + 0.1;
        Object.values(this.players).forEach(player => player.start(ara));
    },
    
    aturarTot(tempsFadeOut = 1) {
        if (!this.isInitialized) return;
        Object.values(this.players).forEach(player => {
            try {
                if (player && player.state === "started") {
                    player.stop(`+${tempsFadeOut}`);
                }
            } catch (e) {}
        });
        this.players = {}; // Netegem els reproductors antics.
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
