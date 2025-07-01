// FILE: assets/js/ui.js
export const UI = {
    // Propietats que s'ompliran a init()
    statusDisplay: null, versionDisplay: null, landingScreen: null, setupScreen: null, 
    sessionScreen: null, apiKeyContainer: null, themeSelectionContainer: null,
    goToSetupBtn: null, saveApiKeyBtn: null, themeCardsContainer: null, 
    startSessionBtn: null, stopSessionBtn: null, toggleListeningBtn: null,
    toggleMusicBtn: null, transcriptPreview: null, soundboard: null, 
    showHelpBtn: null, helpModalOverlay: null, closeHelpBtn: null,
    actionLogContainer: null, actionLogContent: null, toggleLogBtn: null,
    currentInspirationDisplay: null, masterInspirationInput: null,
    musicStatusDot: null, musicStatusText: null,

    init(version) {
        const ids = [ 'status-display','version-display','landing-screen','setup-screen','session-screen',
            'api-key-container','theme-selection-container','api-key-input','save-api-key-btn',
            'theme-cards-container','start-session-btn','stop-session-btn','toggle-listening-btn',
            'toggle-music-btn','transcript-preview','soundboard','show-help-btn','help-modal-overlay',
            'close-help-btn','action-log-container','action-log-content','toggle-log-btn',
            'current-inspiration-display','master-inspiration-input', 'go-to-setup-btn',
            'music-status-dot', 'music-status-text'
        ];
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });
        if (this.versionDisplay) this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
    },
    
    updateStatus(message) { if (this.statusDisplay) this.statusDisplay.textContent = message; },

    updateMusicStatus(isPlaying, name = '') {
        if(this.musicStatusDot) this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
        if(this.musicStatusText) this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
        if(this.toggleMusicBtn) this.toggleMusicBtn.dataset.playing = isPlaying;
        this.setButtonActive(this.toggleMusicBtn, isPlaying);
    },

    updateTranscript(fullText) {
        if(this.transcriptPreview) {
            this.transcriptPreview.textContent = fullText;
            this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
        }
    },
    
    showScreen(screenName) {
        ['landing-screen', 'setup-screen', 'session-screen'].forEach(id => {
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
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        if (!icon || !text) return;
        if (button.id === 'toggle-listening-btn') {
            icon.className = isActive ? 'fas fa-microphone mr-2' : 'fas fa-microphone-slash mr-2';
            text.textContent = isActive ? 'Escoltant' : 'Escoltar';
        } else if (button.id === 'toggle-music-btn') {
            icon.className = isActive ? 'fas fa-pause mr-2' : 'fas fa-play mr-2';
            text.textContent = isActive ? 'Pausa' : 'Play';
        }
    }
};