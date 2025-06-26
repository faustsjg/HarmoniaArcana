// FILE: assets/js/audioManager.js
import { UI } from './ui.js';
import { Director } from './director.js';
export const AudioManager = {
    isInitialized: false, aiMusicPlayers: {}, standbyPlayer: null,
    isAiPlaying: false, isStandbyPlaying: false,

    async init() {
        if (this.isInitialized) return;
        try {
            await Tone.start();
            Tone.Transport.start();
            this.isInitialized = true;
            UI.logToActionPanel("AudioManager inicialitzat.", "success");
        } catch (error) { UI.logToActionPanel(`Error AudioManager.init: ${error.message}`, "error"); }
    },
    playStandbyMusic() {
        if (!this.isInitialized || this.standbyPlayer) return;
        const standbyUrl = './assets/sounds/despertar_de_somnis.mp3';
        UI.logToActionPanel(`Carregant música d'espera: ${standbyUrl}`);
        if (this.standbyPlayer) this.standbyPlayer.dispose();
        this.standbyPlayer = new Tone.Player({
            url: standbyUrl, loop: true, volume: -8, fadeIn: 2,
            onload: () => {
                this.standbyPlayer.start(); this.isStandbyPlaying = true;
                UI.logToActionPanel("Música d'espera carregada i reproduint.", "success");
                UI.updateMusicStatus({ isPlaying: true, title: "Música d'Espera", subtitle: "Tema d'Harmonia Arcana" });
            },
            onerror: (err) => UI.logToActionPanel(`Error carregant standby-music: Assegura't que el fitxer existeix a assets/sounds/`, "error"),
        }).toDestination();
    },
    stopStandbyMusic(fadeOutTime = 1.5) {
        if (this.standbyPlayer && this.standbyPlayer.state === "started") {
            UI.logToActionPanel("Aturant música d'espera...");
            this.standbyPlayer.volume.rampTo(-Infinity, fadeOutTime);
            this.standbyPlayer.stop(`+${fadeOutTime}`);
            this.isStandbyPlaying = false;
        }
    },
    async carregarPistes(pistes) {
        if (!this.isInitialized) return;
        this.stopStandbyMusic();
        this.aturarAITot(0.1, true);
        UI.logToActionPanel(`Carregant ${Object.keys(pistes).length} capes de música IA...`);
        const loadingPromises = Object.keys(pistes).map(key => {
            return new Promise(resolve => {
                this.aiMusicPlayers[key] = new Tone.Player({ url: pistes[key], loop: true, fadeIn: 2, volume: -2, onload: resolve }).toDestination();
            });
        });
        await Promise.all(loadingPromises);
        UI.logToActionPanel("Totes les capes de la IA carregades.", "success");
    },
    toggleAiMusicPlayback() {
        let anyPlayerActive = this.isAiPlaying || this.isStandbyPlaying;
        if (!anyPlayerActive) {
            if (Object.keys(this.aiMusicPlayers).length > 0) {
                this.reproduirAITot();
                UI.updateMusicStatus({ isPlaying: true, title: Director.contextActual.mood, subtitle: Director.inspiracioMestra });
            } else if (this.standbyPlayer) {
                this.standbyPlayer.start(); this.standbyPlayer.volume.rampTo(-8, 0.5);
                this.isStandbyPlaying = true;
                UI.updateMusicStatus({ isPlaying: true, title: "Música d'Espera", subtitle: "Tema d'Harmonia Arcana" });
            }
        } else {
            this.stopStandbyMusic(0.5); this.aturarAITot(0.5);
            UI.updateMusicStatus({ isPlaying: false, title: "En pausa", subtitle: "" });
        }
        UI.setButtonActive(UI.toggleMusicBtn, !anyPlayerActive);
    },
    reproduirAITot() {
        if (!this.isInitialized || Object.keys(this.aiMusicPlayers).length === 0) return;
        const ara = Tone.now() + 0.1;
        Object.values(this.aiMusicPlayers).forEach(player => player.start(ara));
        this.isAiPlaying = true;
        UI.logToActionPanel("Reproduint totes les capes de la IA.", "info");
    },
    aturarAITot(tempsFadeOut = 1, dispose = false) {
        if (!this.isInitialized) return;
        this.isAiPlaying = false;
        Object.values(this.aiMusicPlayers).forEach(player => {
            if (player && player.state === "started") {
                player.volume.rampTo(-Infinity, tempsFadeOut);
                player.stop(`+${tempsFadeOut + 0.1}`);
                if (dispose) setTimeout(() => player.dispose(), (tempsFadeOut + 0.2) * 1000);
            }
        });
        if (dispose) this.aiMusicPlayers = {};
    },
    playSoundEffect(soundFile) {
        if (!this.isInitialized) return;
        const soundUrl = `./assets/sounds/${soundFile}`;
        try {
            const player = new Tone.Player(soundUrl).toDestination();
            player.autostart = true;
            player.onstop = () => player.dispose();
            UI.logToActionPanel(`Reproduint efecte: ${soundFile}`, "info");
        } catch (error) { UI.logToActionPanel(`Error reproduint efecte: ${soundFile}`, "error"); }
    }
};