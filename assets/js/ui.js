// FILE: assets/js/ui.js
export const UI = {
    statusDisplay: null, versionDisplay: null, apiKeyScreen: null,
    setupScreen: null, sessionScreen: null, apiKeyInput: null,
    saveApiKeyBtn: null, changeApiKeyBtn: null, masterInspirationInput: null,
    startSessionBtn: null, stopSessionBtn: null, toggleListeningBtn: null,
    stopMusicBtn: null, transcriptPreview: null, soundboard: null,
    musicStatusDot: null, musicStatusText: null, showHelpBtn: null,
    helpModalOverlay: null, closeHelpBtn: null, actionLogContainer: null,
    actionLogContent: null, toggleLogBtn: null,

    init(version) {
        // Assignació d'elements
        const ids = [
            'status-display', 'version-display', 'api-key-screen', 'setup-screen',
            'session-screen', 'api-key-input', 'save-api-key-btn', 'change-api-key-btn',
            'master-inspiration-input', 'start-session-btn', 'stop-session-btn',
            'toggle-listening-btn', 'stop-music-btn', 'transcript-preview', 'soundboard',
            'show-help-btn', 'help-modal-overlay', 'close-help-btn', 'action-log-container',
            'action-log-content', 'toggle-log-btn'
        ];
        // Converteix els IDs a camelCase per a les propietats de l'objecte
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });
        
        this.musicStatusDot = document.querySelector('.status-dot-music');
        this.musicStatusText = document.getElementById('music-status-text');

        if (this.versionDisplay) this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },
    
    updateStatus(message, isListening = false) { /* ... (sense canvis) ... */ },
    updateMusicStatus(isPlaying, name = '') { /* ... (sense canvis) ... */ },
    updateTranscript(fullText) { /* ... (sense canvis) ... */ },
    showScreen(screenName) { /* ... (sense canvis) ... */ },

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

    showHelpModal() {
        if (this.helpModalOverlay) this.helpModalOverlay.classList.add('visible');
    },

    hideHelpModal() {
        if (this.helpModalOverlay) this.helpModalOverlay.classList.remove('visible');
    },

    setButtonActive(button, isActive) {
        if (!button) return;
        button.classList.toggle('active', isActive);
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        if (!icon || !text) return;

        if (button.id === 'toggle-listening-btn') {
            button.classList.toggle('bg-red-600', isActive);
            button.classList.toggle('hover:bg-red-700', isActive);
            button.classList.toggle('bg-purple-600', !isActive);
            button.classList.toggle('hover:bg-purple-700', !isActive);
            icon.className = isActive ? 'fas fa-microphone mr-2' : 'fas fa-microphone-slash mr-2';
            text.textContent = isActive ? 'Aturar Escolta' : 'Començar a Escoltar';
        } else if (button.id === 'stop-music-btn') {
            const isPlaying = button.dataset.playing === 'true';
            button.classList.toggle('bg-red-500', isPlaying);
            button.classList.toggle('hover:bg-red-600', isPlaying);
            button.classList.toggle('bg-yellow-500', !isPlaying);
            button.classList.toggle('hover:bg-yellow-600', !isPlaying);
            icon.className = isPlaying ? 'fas fa-stop mr-2' : 'fas fa-play mr-2';
            text.textContent = isPlaying ? 'Aturar Música' : 'Reproduir Música';
        }
    }
};
