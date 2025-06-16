// FILE: assets/js/ui.js

export const UI = {
    // Referències als elements del DOM
    statusDisplay: document.getElementById('status-display'),
    versionDisplay: document.getElementById('version-display'),
    
    // Pantalles
    apiKeyScreen: document.getElementById('api-key-screen'),
    setupScreen: document.getElementById('setup-screen'),
    sessionScreen: document.getElementById('session-screen'),
    
    // Entrades i botons
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiKeyBtn: document.getElementById('save-api-key-btn'),
    changeApiKeyBtn: document.getElementById('change-api-key-btn'),
    masterInspirationInput: document.getElementById('master-inspiration-input'),
    startSessionBtn: document.getElementById('start-session-btn'),
    stopSessionBtn: document.getElementById('stop-session-btn'),

    // Panell del DM
    dmEffectsPanel: document.getElementById('dm-effects-panel'),

    init(version) {
        this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },
    
    updateStatus(message, isListening = false) {
        // Afegeix un punt vermell parpellejant si està escoltant
        if (isListening) {
            this.statusDisplay.innerHTML = `<span class="inline-block w-2 h-2 mr-2 bg-red-500 rounded-full animate-pulse"></span> ${message}`;
        } else {
            this.statusDisplay.textContent = message;
        }
    },

    // Funcions per gestionar la visibilitat de les pantalles
    showScreen(screenName) {
        ['apiKeyScreen', 'setupScreen', 'sessionScreen'].forEach(id => {
            this[id].classList.add('hidden');
        });
        if (this[screenName]) {
            this[screenName].classList.remove('hidden');
        }
    },

    showDMPanel() { this.dmEffectsPanel.classList.remove('hidden'); },
    hideDMPanel() { this.dmEffectsPanel.classList.add('hidden'); }
};
