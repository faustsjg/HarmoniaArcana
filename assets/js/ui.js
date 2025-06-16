// FILE: assets/js/ui.js
export const UI = {
    statusDisplay: document.getElementById('status-display'),
    versionDisplay: document.getElementById('version-display'),
    dmEffectsPanel: document.getElementById('dm-effects-panel'),
    apiKeyScreen: document.getElementById('api-key-screen'),
    setupScreen: document.getElementById('setup-screen'),
    sessionScreen: document.getElementById('session-screen'),
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiKeyBtn: document.getElementById('save-api-key-btn'),
    changeApiKeyBtn: document.getElementById('change-api-key-btn'),
    masterInspirationInput: document.getElementById('master-inspiration-input'),
    startSessionBtn: document.getElementById('start-session-btn'),
    stopSessionBtn: document.getElementById('stop-session-btn'),
    toggleListeningBtn: document.getElementById('toggle-listening-btn'),
    stopMusicBtn: document.getElementById('stop-music-btn'),
    transcriptPreview: document.getElementById('transcript-preview'),
    soundboard: document.getElementById('soundboard'),
    musicStatusDot: document.querySelector('.status-dot-music'),
    musicStatusText: document.getElementById('music-status-text'),

    init(version) {
        this.versionDisplay.textContent = `Harmonia Arcana ${version}`;
        console.log(`UI Inicialitzada. Versió: ${version}`);
    },
    
    updateStatus(message, isListening = false) { /* ... (sense canvis) ... */ },
    updateMusicStatus(isPlaying, name = '') { /* ... (sense canvis) ... */ },
    updateTranscript(fullText) { /* ... (sense canvis) ... */ },
    
    // Funció actualitzada amb missatges de diagnòstic
    showScreen(screenName) {
        console.log(`[UI.showScreen] Petició per mostrar: "${screenName}"`);
        const allScreenIds = ['api-key-screen', 'setup-screen', 'session-screen'];

        allScreenIds.forEach(id => {
            const screen = document.getElementById(id);
            if (screen) {
                screen.classList.add('hidden');
            } else {
                console.error(`[UI.showScreen] ATENCIÓ: L'element #${id} no s'ha trobat a l'HTML.`);
            }
        });

        const screenToShow = document.getElementById(screenName);
        if (screenToShow) {
            console.log(`[UI.showScreen] Element #${screenName} trobat a l'HTML.`);
            console.log(`[UI.showScreen] Llista de classes ABANS de modificar: "${screenToShow.className}"`);
            screenToShow.classList.remove('hidden');
            console.log(`[UI.showScreen] Llista de classes DESPRÉS de modificar: "${screenToShow.className}"`);
        } else {
            console.error(`[UI.showScreen] ERROR CRÍTIC: No s'ha trobat la pantalla amb l'ID "${screenName}"`);
        }
    },

    showDMPanel() { if(this.dmEffectsPanel) this.dmEffectsPanel.classList.remove('hidden'); },
    hideDMPanel() { if(this.dmEffectsPanel) this.dmEffectsPanel.classList.add('hidden'); }
};
