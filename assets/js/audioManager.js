// FILE: assets/js/audioManager.js
import { UI } from './ui.js';

export const AudioManager = {
    isInitialized: false,
    player: null,
    currentTrackUrl: null,

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            Tone.Transport.start();
            this.isInitialized = true;
        } catch (error) { console.error("Error inicialitzant AudioManager:", error); }
    },
    
    reproduirPista(url, name) {
        if (!this.isInitialized) return;

        // Aturem la pista anterior amb un fade-out
        if (this.player && this.player.state === "started") {
            this.player.volume.rampTo(-Infinity, 1.5);
            this.player.stop("+1.6");
        }

        this.currentTrackUrl = url;
        this.player = new Tone.Player({
            url: url,
            loop: true,
            volume: -Infinity,
            onload: () => {
                this.player.start();
                this.player.volume.rampTo(0, 2.0); // Fade-in de 2 segons
                UI.updateMusicStatus(true, name);
            },
            onerror: (err) => UI.updateMusicStatus(false, `Error: ${name}`),
        }).toDestination();
    },

    aturarTot(tempsFadeOut = 1) {
        if (this.player && this.player.state === "started") {
            this.player.volume.rampTo(-Infinity, tempsFadeOut);
            this.player.stop(`+${tempsFadeOut}`);
            this.currentTrackUrl = null;
            UI.updateMusicStatus(false);
        }
    }
};
