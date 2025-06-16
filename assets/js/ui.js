// FILE: assets/js/ui.js
export const UI = {
    // Referències generals
    statusDisplay: document.getElementById('status-display'),
    versionDisplay: document.getElementById('version-display'),
    
    // ELIMINAT: dmEffectsPanel
    
    // Pantalles
    apiKeyScreen: document.getElementById('api-key-screen'),
    setupScreen: document.getElementById('setup-screen'),
    sessionScreen: document.getElementById('session-screen'),
    
    // ... (la resta de referències es mantenen igual) ...
    masterInspirationInput: document.getElementById('master-inspiration-input'),
    startSessionBtn: document.getElementById('start-session-btn'),
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
    
    // ... (la resta de funcions com updateStatus, updateMusicStatus, etc., es mantenen igual) ...
    updateStatus(message, isListening = false) { /*...*/ },
    updateMusicStatus(isPlaying, name = '') { /*...*/ },
    updateTranscript(fullText) { /*...*/ },
    showScreen(screenName) { /*...*/ },

    // ELIMINAT: Ja no necessitem showDMPanel ni hideDMPanel
};
