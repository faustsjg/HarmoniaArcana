// FILE: assets/js/ui.js
export const UI = {
    // Propietats inicialitzades a null
    statusDisplay: null, versionDisplay: null, apiKeyScreen: null,
    setupScreen: null, sessionScreen: null, apiKeyInput: null,
    saveApiKeyBtn: null, changeApiKeyBtn: null, masterInspirationInput: null,
    startSessionBtn: null, stopSessionBtn: null, toggleListeningBtn: null,
    stopMusicBtn: null, transcriptPreview: null, soundboard: null,
    musicStatusDot: null, musicStatusText: null,

    // La funció init assigna tots els elements del DOM d'una sola vegada.
    init(version) {
        this.statusDisplay = document.getElementById('status-display');
        this.versionDisplay = document.getElementById('version-display');
        this.apiKeyScreen = document.getElementById('api-key-screen');
        this.setupScreen = document.getElementById('setup-screen');
        this.sessionScreen = document.getElementById('session-screen');
        this.apiKeyInput = document.getElementById('api-key-input');
        this.saveApiKeyBtn = document.getElementById('save-api-key-btn');
        this.changeApiKeyBtn = document.getElementById('change-api-key-btn');
        this.startSessionBtn = document.getElementById('start-session-btn');
        this.masterInspirationInput = document.getElementById('master-inspiration-input');
        this.stopSessionBtn = document.getElementById('stop-session-btn');
        this.toggleListeningBtn = document.getElementById('toggle-listening-btn');
        this.stopMusicBtn = document.getElementById('stop-music-btn');
        this.transcriptPreview = document.getElementById('transcript-preview');
        this.soundboard = document.getElementById('soundboard');
        this.musicStatusDot = document.querySelector('.status-dot-music');
        this.musicStatusText = document.getElementById('music-status-text');

        if (this.versionDisplay) this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },
    
    updateStatus(message, isListening = false) {
        if (!this.statusDisplay) return;
        this.statusDisplay.innerHTML = isListening 
            ? `<span class="inline-block w-2 h-2 mr-2 bg-red-500 rounded-full animate-pulse"></span> ${message}` 
            : message;
    },

    updateMusicStatus(isPlaying, name = '') {
        if(this.musicStatusDot) this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
        if(this.musicStatusText) this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
    },

    updateTranscript(fullText) {
        if(this.transcriptPreview) {
            this.transcriptPreview.textContent = fullText;
            this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
        }
    },
    
    showScreen(screenName) {
        ['api-key-screen', 'setup-screen', 'session-screen'].forEach(id => {
            const screen = document.getElementById(id);
            if(screen) screen.style.display = 'none';
        });
        const screenToShow = document.getElementById(screenName);
        if (screenToShow) screenToShow.style.display = 'block';
    }
};
