// FILE: assets/js/ui.js
export const UI = {
    statusDisplay: null, versionDisplay: null, apiKeyScreen: null,
    setupScreen: null, sessionScreen: null, apiKeyInput: null,
    saveApiKeyBtn: null, changeApiKeyBtn: null, startSessionBtn: null,
    stopSessionBtn: null, toggleListeningBtn: null, transcriptPreview: null,
    musicStatusDot: null, musicStatusText: null,

    init(version) {
        const ids = ['status-display','version-display','api-key-screen','setup-screen','session-screen',
            'api-key-input','save-api-key-btn','change-api-key-btn','start-session-btn',
            'stop-session-btn','toggle-listening-btn','transcript-preview'
        ];
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });
        this.musicStatusDot = document.getElementById('music-status-dot');
        this.musicStatusText = document.getElementById('music-status-text');
        if (this.versionDisplay) this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
    },
    updateStatus(message) { if (this.statusDisplay) this.statusDisplay.textContent = message; },
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
    },
    setButtonActive(button, isActive) {
        if (!button) return;
        button.classList.toggle('active', isActive);
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        if (!icon || !text) return;
        if (button.id === 'toggle-listening-btn') {
            icon.className = isActive ? 'fas fa-microphone mr-2' : 'fas fa-microphone-slash mr-2';
            text.textContent = isActive ? 'Escoltant' : 'Escoltar';
        }
    }
};
