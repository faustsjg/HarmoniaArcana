// FILE: assets/js/ui.js
export const UI = {
    statusDisplay: null, versionDisplay: null, apiKeyScreen: null,
    setupScreen: null, sessionScreen: null, masterInspirationInput: null,
    startSessionBtn: null, changeApiKeyBtn: null, showHelpBtn: null,
    helpModalOverlay: null, closeHelpBtn: null, actionLogContainer: null,
    actionLogContent: null, toggleLogBtn: null, toggleListeningBtn: null,
    toggleMusicBtn: null, stopSessionBtn: null, soundboard: null,
    apiKeyInput: null, saveApiKeyBtn: null,
    currentInspirationDisplay: null, musicTitle: null, musicSubtitle: null,
    transcriptPreview: null,
    
    init(version) {
        const ids = ['status-display','version-display','api-key-screen','setup-screen','session-screen',
            'api-key-input','save-api-key-btn','change-api-key-btn','master-inspiration-input',
            'start-session-btn','stop-session-btn','toggle-listening-btn','toggle-music-btn',
            'transcript-preview','soundboard','show-help-btn','help-modal-overlay','close-help-btn',
            'action-log-container','action-log-content','toggle-log-btn',
            'current-inspiration-display', 'music-title', 'music-subtitle'
        ];
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });
        if (this.versionDisplay) this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
    },
    
    updateStatus(message) { if (this.statusDisplay) this.statusDisplay.textContent = message; },

    updateMusicStatus(status) {
        if(this.musicTitle) this.musicTitle.textContent = status.title;
        if(this.musicSubtitle) this.musicSubtitle.textContent = status.subtitle;
        if(this.toggleMusicBtn) this.toggleMusicBtn.dataset.playing = status.isPlaying;
        this.setButtonActive(this.toggleMusicBtn, status.isPlaying);
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

    logToActionPanel(message, level = 'info') {
        if (!this.actionLogContent) return;
        const p = document.createElement('p');
        p.className = `log-message log-${level}`;
        const time = new Date().toLocaleTimeString();
        p.textContent = `[${time}] ${message}`;
        this.actionLogContent.appendChild(p);
        this.actionLogContent.scrollTop = this.actionLogContent.scrollHeight;
    },
    
    toggleLogPanel() {
        if (!this.actionLogContainer) return;
        const isVisible = this.actionLogContainer.classList.toggle('visible');
        this.toggleLogBtn.textContent = isVisible ? 'Amagar Registre' : 'Mostrar Registre';
    },

    showHelpModal() { if (this.helpModalOverlay) this.helpModalOverlay.classList.add('visible'); },
    hideHelpModal() { if (this.helpModalOverlay) this.helpModalOverlay.classList.remove('visible'); },

    setButtonActive(button, isActive) {
        if (!button) return;
        button.classList.toggle('active', isActive);
        if (button.id === 'toggle-listening-btn') {
            const icon = button.querySelector('i');
            const text = button.querySelector('span');
            if(icon) icon.className = isActive ? 'fas fa-microphone mr-2' : 'fas fa-microphone-slash mr-2';
            if(text) text.textContent = isActive ? 'Escoltant' : 'Escoltar';
        } else if (button.id === 'toggle-music-btn') {
            const icon = button.querySelector('i');
            const text = button.querySelector('span');
            const isPlaying = button.dataset.playing === 'true';
            if(icon) icon.className = isPlaying ? 'fas fa-pause mr-2' : 'fas fa-play mr-2';
            if(text) text.textContent = isPlaying ? 'Pausa' : 'Play';
        }
    }
};
