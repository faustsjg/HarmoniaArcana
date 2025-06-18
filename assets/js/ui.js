// FILE: assets/js/ui.js
export const UI = {
    statusDisplay: document.getElementById('status-display'),
    versionDisplay: document.getElementById('version-display'),
    
    apiKeyScreen: document.getElementById('api-key-screen'),
    setupScreen: document.getElementById('setup-screen'),
    howToScreen: document.getElementById('how-to-screen'), // NOU
    sessionScreen: document.getElementById('session-screen'),
    
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiKeyBtn: document.getElementById('save-api-key-btn'),
    changeApiKeyBtn: document.getElementById('change-api-key-btn'),
    masterInspirationInput: document.getElementById('master-inspiration-input'),
    setupContinueBtn: document.getElementById('setup-continue-btn'), // NOU
    startSessionBtn: document.getElementById('start-session-btn'),
    
    stopSessionBtn: document.getElementById('stop-session-btn'),
    toggleListeningBtn: document.getElementById('toggle-listening-btn'),
    stopMusicBtn: document.getElementById('stop-music-btn'),
    transcriptPreview: document.getElementById('transcript-preview'),
    soundboard: document.getElementById('soundboard'),
    musicStatusDot: document.querySelector('.status-dot-music'),
    musicStatusText: document.getElementById('music-status-text'),

    init(version) { /* ... (sense canvis) ... */ },
    updateStatus(message, isListening = false) { /* ... (sense canvis) ... */ },
    updateMusicStatus(isPlaying, name = '') { /* ... (sense canvis) ... */ },
    updateTranscript(fullText) { /* ... (sense canvis) ... */ },
    
    showScreen(screenName) {
        // NOU: Llista actualitzada de totes les pantalles
        ['api-key-screen', 'setup-screen', 'how-to-screen', 'session-screen'].forEach(id => {
            const screen = document.getElementById(id);
            if(screen) screen.style.display = 'none';
        });
        const screenToShow = document.getElementById(screenName);
        if (screenToShow) screenToShow.style.display = 'block';
    },
};
