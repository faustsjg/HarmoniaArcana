// FILE: assets/js/ui.js
export const UI = {
    // Propietats
    landingScreen: null, setupScreen: null, sessionScreen: null, apiKeyContainer: null,
    themeSelectionContainer: null, goToSetupBtn: null, saveApiKeyBtn: null,
    themeCardsContainer: null, startSessionBtn: null, changeApiKeyBtn: null,
    backToLandingBtn: null, versionDisplay: null,
    // ... la resta de propietats per a la sessió activa
    
    init(version) {
        // Un mètode més segur per assignar tots els elements
        const ids = [
            'landing-screen', 'setup-screen', 'session-screen', 'api-key-container',
            'theme-selection-container', 'go-to-setup-btn', 'save-api-key-btn',
            'theme-cards-container', 'start-session-btn', 'change-api-key-btn',
            'back-to-landing-btn', 'version-display', 'api-key-input',
            'master-inspiration-input', 'session-inspiration-display', 'status-display',
            'show-help-btn', 'help-modal-overlay', 'close-help-btn',
            'timeline-header', 'timeline-container', 'toggle-listening-btn', 'toggle-music-btn',
            'stop-session-btn', 'soundboard', 'transcript-preview', 'music-status-text'
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

    // La resta de funcions (addTimelineEvent, setButtonActive, etc.) es mantenen igual
    // ...
};