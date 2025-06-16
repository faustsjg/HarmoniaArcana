// FILE: assets/js/ui.js

// Un objecte per agrupar tots els elements de la UI i les funcions que els manipulen.
export const UI = {
    // Referències als elements del DOM
    statusDisplay: document.getElementById('status-display'),
    dmEffectsPanel: document.getElementById('dm-effects-panel'),
    startSessionBtn: document.getElementById('start-session-btn'),
    stopSessionBtn: document.getElementById('stop-session-btn'),
    masterInspirationInput: document.getElementById('master-inspiration-input'),
    setupScreen: document.getElementById('setup-screen'),
    sessionScreen: document.getElementById('session-screen'),
    versionDisplay: document.getElementById('version-display'),

    // Funció d'inicialització.
    init(version) {
        this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },

    // Funció per actualitzar el text d'estat a la capçalera.
    updateStatus(message) {
        this.statusDisplay.textContent = message;
        console.log(`UI Status: ${message}`);
    },

    // Mostra el panell d'efectes del DM.
    showDMPanel() {
        this.dmEffectsPanel.classList.remove('hidden');
    },
    
    // Amaga el panell d'efectes del DM.
    hideDMPanel() {
        this.dmEffectsPanel.classList.add('hidden');
    },

    // Funció per canviar de la pantalla de configuració a la de sessió activa.
    showSessionScreen() {
        this.setupScreen.classList.add('hidden');
        this.sessionScreen.classList.remove('hidden');
    },

    // Funció per tornar a la pantalla de configuració.
    showSetupScreen() {
        this.sessionScreen.classList.add('hidden');
        this.setupScreen.classList.remove('hidden');
    }
};
