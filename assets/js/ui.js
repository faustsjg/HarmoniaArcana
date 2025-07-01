// FILE: assets/js/ui.js
export const UI = {
    // Propietats que s'ompliran a init()
    statusDisplay: null, versionDisplay: null, landingScreen: null, setupScreen: null,
    sessionScreen: null, apiKeyContainer: null, themeSelectionContainer: null,
    goToSetupBtn: null, saveApiKeyBtn: null, themeCardsContainer: null, 
    startSessionBtn: null, stopSessionBtn: null, toggleListeningBtn: null,
    toggleMusicBtn: null, transcriptPreview: null, soundboard: null, 
    showHelpBtn: null, helpModalOverlay: null, closeHelpBtn: null,
    timelineHeader: null, timelineContainer: null, backToLandingBtn: null,
    currentInspirationDisplay: null, masterInspirationInput: null,
    apiKeyInput: null, prepTitle: null, trackUploadList: null,
    playSessionBtn: null, musicStatusDot: null, musicStatusText: null,

    init(version) {
        const ids = [
            'status-display', 'version-display', 'landing-screen', 'setup-screen',
            'session-screen', 'api-key-container', 'theme-selection-container',
            'go-to-setup-btn', 'save-api-key-btn', 'theme-cards-container', 'start-session-btn',
            'change-api-key-btn', 'back-to-landing-btn', 'api-key-input', 'master-inspiration-input',
            'prep-title', 'track-upload-list', 'play-session-btn',
            'session-inspiration-display', 'show-help-btn', 'help-modal-overlay', 'close-help-btn',
            'timeline-header', 'timeline-container', 'toggle-listening-btn', 'toggle-music-btn',
            'stop-session-btn', 'soundboard', 'transcript-preview', 'music-status-text'
        ];
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });
        
        this.musicStatusDot = document.querySelector('.status-dot-music');

        if (this.versionDisplay) {
            this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        }
    },
    
    showScreen(screenName) {
        ['landing-screen', 'setup-screen', 'track-prep-screen', 'session-screen'].forEach(id => {
            const screen = document.getElementById(id);
            if(screen) screen.style.display = 'none';
        });
        const screenToShow = document.getElementById(screenName);
        if (screenToShow) {
            screenToShow.style.display = 'block';
            if (screenToShow.id !== 'session-screen') {
                screenToShow.style.display = 'flex';
                screenToShow.style.flexDirection = 'column';
                screenToShow.style.alignItems = 'center';
                screenToShow.style.justifyContent = 'center';
            }
        }
    },

    updateStatus(message) {
        if (this.statusDisplay) this.statusDisplay.textContent = message;
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
        if(this.musicStatusDot) this.musicStatusDot.style.backgroundColor = status.isPlaying ? '#10b981' : '#6b7280';
        if(this.musicStatusText) this.musicStatusText.textContent = status.isPlaying ? status.title : 'Aturada';
    },

    toggleTimeline() {
        if (!this.timelineContainer) return;
        const icon = this.timelineHeader.querySelector('i');
        const isVisible = !this.timelineContainer.classList.contains('hidden');
        this.timelineContainer.classList.toggle('hidden');
        if(icon) icon.className = isVisible ? 'fas fa-chevron-down text-xs ml-1' : 'fas fa-chevron-up text-xs ml-1';
    },

    addTimelineEvent(message, icon = 'fa-solid fa-circle-info', level = 'info') {
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
};