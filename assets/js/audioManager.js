import { UI } from './ui.js';
import { Director } from './director.js';

export const AudioManager = {
    isInitialized: false,
    currentPlayer: null,
    isPlaying: false,

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            Tone.Transport.start();
            this.isInitialized = true;
        } catch (error) { console.error("Error inicialitzant AudioManager:", error); }
    },

    reproduirPista(url, trackName) {
        if (!this.isInitialized) return;

        const oldPlayer = this.currentPlayer;
        if (oldPlayer) {
            oldPlayer.volume.rampTo(-Infinity, 1.5); // Fade out de la pista antiga
            oldPlayer.stop("+1.6");
        }
        
        UI.updateStatus(`Carregant: ${trackName}...`);
        
        const newPlayer = new Tone.Player({
            url: url,
            loop: true,
            volume: -Infinity,
            onload: () => {
                newPlayer.start();
                newPlayer.volume.rampTo(0, 2.0); // Fade in de la pista nova
                this.isPlaying = true;
                UI.updateMusicStatus({ isPlaying: true, title: trackName, subtitle: Director.inspiracioMestra });
                UI.updateStatus(Speech.isListening ? "Escoltant..." : "Pots començar a escoltar.");
            },
            onerror: (err) => {
                UI.updateMusicStatus({isPlaying: false, title: "Error", subtitle: `No s'ha pogut carregar ${trackName}`});
                console.error(err);
            },
        }).toDestination();

        this.currentPlayer = newPlayer;
    },

    togglePlayback() {
        if (!this.currentPlayer) return;
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.currentPlayer.start(Tone.now());
            this.currentPlayer.volume.rampTo(0, 0.5);
        } else {
            this.currentPlayer.volume.rampTo(-Infinity, 0.5);
            this.currentPlayer.stop("+0.6");
        }
        UI.updateMusicStatus({ isPlaying: this.isPlaying, title: Director.contextActual.mood, subtitle: Director.inspiracioMestra });
    },
    
    aturarTot(tempsFadeOut = 0.5) {
        if (this.currentPlayer) {
            this.currentPlayer.volume.rampTo(-Infinity, tempsFadeOut);
            this.currentPlayer.stop(`+${tempsFadeOut}`);
        }
        this.isPlaying = false;
        UI.updateMusicStatus(false);
    },

    playSoundEffect(soundFile) {
        if (!this.isInitialized) return;
        const soundUrl = `./assets/sounds/${soundFile}`;
        try {
            const player = new Tone.Player(soundUrl).toDestination();
            player.autostart = true;
            player.onstop = () => player.dispose();
        } catch (error) { console.error(`Error reproduint efecte: ${soundFile}`, error); }
    }
};
