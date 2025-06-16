// FILE: assets/js/audioManager.js

export const AudioManager = {
    isInitialized: false,
    players: {},

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            // Ja no connectem a una cadena d'efectes manuals complexa
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
                }).toDestination(); // Connectem directament a la sortida
            });
        });
        await Promise.all(loadingPromises);
    },

    reproduirTot() { /* ... (sense canvis) ... */ },
    aturarTot(tempsFadeOut = 1) { /* ... (sense canvis) ... */ },
    playSoundEffect(soundFile) { /* ... (sense canvis) ... */ },

    // ELIMINAT: triggerDMEffect ja no existeix
};
