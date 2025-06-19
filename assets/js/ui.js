// FILE: assets/js/ui.js
export const UI = {
    statusDisplay: document.getElementById('status-display'),
    versionDisplay: document.getElementById('version-display'),
    
    // Pantalles
    apiKeyScreen: document.getElementById('api-key-screen'),
    setupScreen: document.getElementById('setup-screen'),
    sessionScreen: document.getElementById('session-screen'),
    
    // Botons principals
    startSessionBtn: document.getElementById('start-session-btn'),
    changeApiKeyBtn: document.getElementById('change-api-key-btn'),
    
    // NOU: Elements del Modal d'Ajuda
    helpModalOverlay: document.getElementById('help-modal-overlay'),
    showHelpBtn: document.getElementById('show-help-btn'),
    closeHelpBtn: document.getElementById('close-help-btn'),

    init(version) {
        this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },
    
    showScreen(screenName) {
        ['api-key-screen', 'setup-screen', 'session-screen'].forEach(id => {
            const screen = document.getElementById(id);
            if(screen) screen.style.display = 'none';
        });
        const screenToShow = document.getElementById(screenName);
        if (screenToShow) screenToShow.style.display = 'block';
    },

    // NOU: Funcions per controlar la visibilitat del modal
    showHelpModal() {
        if (this.helpModalOverlay) this.helpModalOverlay.classList.add('visible');
    },
    hideHelpModal() {
        if (this.helpModalOverlay) this.helpModalOverlay.classList.remove('visible');
    },
    
    // ... la resta de funcions d'UI (updateStatus, etc.) es mantenen igual.
};
