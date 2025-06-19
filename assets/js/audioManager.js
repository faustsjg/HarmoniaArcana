export const AudioManager = {
    isInitialized: false, players: {},

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            Tone.Transport.start();
            this.isInitialized = true;
            console.log("AudioManager Inicialitzat CORRECTAMENT.");
        } catch (error) { console.error("Error inicialitzant l'AudioManager:", error); }
    },

    async carregarPistes(pistes) { /* ... (contingut sense canvis) ... */ },
    reproduirTot() { /* ... (contingut sense canvis) ... */ },
    aturarTot(tempsFadeOut = 1) { /* ... (contingut sense canvis) ... */ },
    playSoundEffect(soundFile) { /* ... (contingut sense canvis) ... */ }
};
