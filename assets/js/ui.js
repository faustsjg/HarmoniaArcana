// FILE: assets/js/ui.js
export const UI = {
    // Referències generals
    statusDisplay: document.getElementById('status-display'),
    versionDisplay: document.getElementById('version-display'),
    dmEffectsPanel: document.getElementById('dm-effects-panel'),
    
    // Pantalles
    apiKeyScreen: document.getElementById('api-key-screen'),
    setupScreen: document.getElementById('setup-screen'),
    sessionScreen: document.getElementById('session-screen'),
    
    // Elements de configuració
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiKeyBtn: document.getElementById('save-api-key-btn'),
    changeApiKeyBtn: document.getElementById('change-api-key-btn'),
    masterInspirationInput: document.getElementById('master-inspiration-input'),
    startSessionBtn: document.getElementById('start-session-btn'),
    
    // Elements de la sessió activa
    stopSessionBtn: document.getElementById('stop-session-btn'),
    toggleListeningBtn: document.getElementById('toggle-listening-btn'),
    stopMusicBtn: document.getElementById('stop-music-btn'),
    transcriptPreview: document.getElementById('transcript-preview'),
    soundboard: document.getElementById('soundboard'),
    musicStatusDot: document.querySelector('.status-dot-music'),
    musicStatusText: document.getElementById('music-status-text'),

    init(version) {
        this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },
    
    updateStatus(message, isListening = false) {
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
        ['apiKeyScreen', 'setupScreen', 'sessionScreen'].forEach(id => {
            const screen = document.getElementById(id);
            if(screen) screen.classList.add('hidden');
        });
        const screenToShow = document.getElementById(screenName);
        if (screenToShow) screenToShow.classList.remove('hidden');
    },

    showDMPanel() { 
        if(this.dmEffectsPanel) this.dmEffectsPanel.classList.remove('hidden'); 
    },
    hideDMPanel() { 
        if(this.dmEffectsPanel) this.dmEffectsPanel.classList.add('hidden');
    }
};
