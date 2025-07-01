// FILE: assets/js/ui.js
export const UI = {
    // Propietats que s'ompliran a init()
    statusDisplay: null, versionDisplay: null, landingScreen: null, setupScreen: null,
    sessionScreen: null, apiKeyContainer: null, themeSelectionContainer: null,
    goToSetupBtn: null, saveApiKeyBtn: null, themeCardsContainer: null, 
    startSessionBtn: null, changeApiKeyBtn: null, backToLandingBtn: null,
    apiKeyInput: null, masterInspirationInput: null, sessionInspirationDisplay: null,
    prepTitle: null, trackUploadList: null, playSessionBtn: null,
    timelineHeader: null, timelineStatusText: null, timelineContainer: null,
    toggleListeningBtn: null, toggleMusicBtn: null, stopSessionBtn: null,
    transcriptPreview: null, soundboard: null, showHelpBtn: null, 
    helpModalOverlay: null, closeHelpBtn: null,
    actionLogContainer: null, actionLogContent: null, toggleLogBtn: null,
    musicStatusDot: null, musicStatusText: null,
    
    init(version) {
        const ids = [
            'status-display', 'version-display', 'landing-screen', 'setup-screen', 
            'session-screen', 'api-key-container', 'theme-selection-container',
            'go-to-setup-btn', 'save-api-key-btn', 'theme-cards-container', 'start-session-btn',
            'change-api-key-btn', 'back-to-landing-btn', 'api-key-input',
            'master-inspiration-input', 'session-inspiration-display', 
            'prep-title', 'track-upload-list', 'play-session-btn', 'timeline-header',
            'timeline-container', 'toggle-listening-btn', 'toggle-music-btn',
            'stop-session-btn', 'soundboard', 'transcript-preview',
            'show-help-btn', 'help-modal-overlay', 'close-help-btn',
            'action-log-container', 'action-log-content', 'toggle-log-btn', 'music-status-text'
        ];
        ids.forEach(id => {
            const propName = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
            this[propName] = document.getElementById(id);
        });
        
        this.musicStatusDot = document.querySelector('.status-dot-music');
        this.timelineStatusText = document.getElementById('timeline-status-text');

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
            screenToShow.style.display = 'flex';
            screenToShow.style.flexDirection = 'column';
            screenToShow.style.alignItems = 'center';
            screenToShow.style.justifyContent = 'center';
        }
    },

    updateStatus(message) {
        if (this.timelineStatusText) {
            this.timelineStatusText.textContent = message;
        } else if (this.statusDisplay) {
            this.statusDisplay.textContent = message;
        }
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
        if(this.toggleMusicBtn) this.toggleMusicBtn.dataset.playing = status.isPlaying;
        this.setButtonActive(this.toggleMusicBtn, status.isPlaying);
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

    showHelpModal() { 
        if (this.helpModalOverlay) this.helpModalOverlay.classList.add('visible'); 
    },
    hideHelpModal() { 
        if (this.helpModalOverlay) this.helpModalOverlay.classList.remove('visible'); 
    },

    updateTranscript(fullText) {
        if(this.transcriptPreview) {
            this.transcriptPreview.textContent = fullText;
            this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
        }
    }
};