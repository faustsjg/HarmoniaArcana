// FILE: assets/js/ui.js
export const UI = {
    // Propietats que s'ompliran a init()
    statusDisplay: null, versionDisplay: null, landingScreen: null, setupScreen: null, 
    sessionScreen: null, apiKeyContainer: null, themeSelectionContainer: null,
    apiKeyInput: null, saveApiKeyBtn: null, themeCardsContainer: null, 
    startSessionBtn: null, stopSessionBtn: null, toggleListeningBtn: null,
    toggleMusicBtn: null, transcriptPreview: null, soundboard: null, 
    showHelpBtn: null, helpModalOverlay: null, closeHelpBtn: null,
    timelineHeader: null, timelineContainer: null, 
    currentInspirationDisplay: null, masterInspirationInput: null,
    
    init(version) {
        const ids = [
            'status-display', 'version-display', 'landing-screen', 'setup-screen',
            'session-screen', 'api-key-container', 'theme-selection-container',
            'api-key-input', 'save-api-key-btn', 'theme-cards-container', 'start-session-btn',
            'stop-session-btn', 'toggle-listening-btn', 'toggle-music-btn', 'transcript-preview',
            'soundboard', 'show-help-btn', 'help-modal-overlay', 'close-help-btn',
            'timeline-header', 'timeline-container', 'current-inspiration-display',
            'master-inspiration-input'
        ];
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });

        if (this.versionDisplay) this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
    },
    
    showScreen(screenName) {
        ['landing-screen', 'setup-screen', 'session-screen'].forEach(id => {
            const screen = document.getElementById(id);
            if(screen) screen.style.display = 'none';
        });
        const screenToShow = document.getElementById(screenName);
        if (screenToShow) screenToShow.style.display = 'block';
    },

    addTimelineEvent(message, icon = 'fa-solid fa-circle-info') {
        if (!this.timelineContainer) return;
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-event';
        eventElement.innerHTML = `
            <div class="timeline-icon"><i class="fas ${icon}"></i></div>
            <div class="timeline-content">
                <p class="message">${message}</p>
                <p class="time">${new Date().toLocaleTimeString()}</p>
            </div>
        `;
        this.timelineContainer.appendChild(eventElement);
        this.timelineContainer.scrollTop = this.timelineContainer.scrollHeight;
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
        } else if (button.id === 'toggle-music-btn') {
            const isPlaying = button.dataset.playing === 'true';
            icon.className = isPlaying ? 'fas fa-pause mr-2' : 'fas fa-play mr-2';
            text.textContent = isPlaying ? 'Pausa' : 'Play';
        }
    },

    updateMusicStatus(status) {
        if(this.statusDisplay) this.statusDisplay.textContent = status.subtitle;
    },
    
    // Altres funcions (updateTranscript, showHelpModal, etc.)
    updateTranscript(text) { if(this.transcriptPreview) this.transcriptPreview.textContent = text; },
    showHelpModal() { if (this.helpModalOverlay) this.helpModalOverlay.classList.add('visible'); },
    hideHelpModal() { if (this.helpModalOverlay) this.helpModalOverlay.classList.remove('visible'); },
    toggleTimeline() { if(this.timelineContainer) this.timelineContainer.classList.toggle('hidden'); }
};
