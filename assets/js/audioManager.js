// FILE: assets/js/audioManager.js
import { UI } from './ui.js';

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
            UI.logToActionPanel("AudioManager inicialitzat.", "success");
        } catch (error) { UI.logToActionPanel(`Error inicialitzant AudioManager: ${error.message}`, "error"); }
    },

    playStandbyMusic() {
        if (!this.isInitialized || this.standbyPlayer) return;
        const standbyUrl = 'assets/sounds/standby-music.mp3';
        UI.logToActionPanel(`Carregant música d'espera: ${standbyUrl}`);
        this.standbyPlayer = new Tone.Player({
            url: standbyUrl, loop: true, volume: -12, fadeIn: 2,
            onload: () => {
                UI.logToActionPanel("Música d'espera carregada i reproduint.", "success");
                UI.updateMusicStatus(true, "Música d'espera");
            },
            onerror: (err) => UI.logToActionPanel(`Error carregant la música d'espera: ${err}`, "error"),
        }).toDestination();
        this.standbyPlayer.autostart = true;
    },

    stopStandbyMusic(fadeOutTime = 1.5) {
        if (this.standbyPlayer && this.standbyPlayer.state === "started") {
            UI.logToActionPanel("Aturant música d'espera...");
            this.standbyPlayer.volume.rampTo(-Infinity, fadeOutTime);
            this.standbyPlayer.stop(`+${fadeOutTime}`);
        }
    },

    async carregarPistes(pistes) {
        if (!this.isInitialized) return;
        this.stopStandbyMusic();
        this.aturarTot(0.1);
        
        UI.logToActionPanel(`Carregant ${Object.keys(pistes).length} capes de música IA...`);
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                this.aiMusicPlayers[key] = new Tone.Player({
                    url: pistes[key], loop: true, fadeIn: 2,
                    onload: resolve,
                }).toDestination();
            });
        });
        await Promise.all(loadingPromises);
        UI.logToActionPanel("Totes les capes de la IA carregades.", "success");
    },

    reproduirTot() {
        if (!this.isInitialized || Object.keys(this.aiMusicPlayers).length === 0) return;
        const ara = Tone.now() + 0.1;
        Object.values(this.aiMusicPlayers).forEach(player => player.start(ara));
        UI.logToActionPanel("Reproduint totes les capes de la IA.", "info");
    },
    
    aturarTot(tempsFadeOut = 1) {
        if (!this.isInitialized) return;
        UI.logToActionPanel("Aturant totes les pistes de la IA...");
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
            UI.logToActionPanel(`Reproduint efecte: ${soundFile}`, "info");
        } catch (error) { UI.logToActionPanel(`Error reproduint efecte: ${soundFile}`, "error"); }
    }
};
