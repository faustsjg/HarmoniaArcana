// FILE: assets/js/ui.js
export const UI = {
    // ... (totes les referències als elements, incloent les noves)
    showHelpBtn: document.getElementById('show-help-btn'),
    helpModalOverlay: document.getElementById('help-modal-overlay'),
    closeHelpBtn: document.getElementById('close-help-btn'),
    actionLogContainer: document.getElementById('action-log-container'),
    actionLogContent: document.getElementById('action-log-content'),
    toggleLogBtn: document.getElementById('toggle-log-btn'),

    init(version) { /* ... */ },
    
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
            button.classList.toggle('bg-red-500', !isActive);
            button.classList.toggle('hover:bg-red-600', !isActive);
            button.classList.toggle('bg-yellow-500', isActive);
            button.classList.toggle('hover:bg-yellow-600', isActive);
            icon.className = isActive ? 'fas fa-pause mr-2' : 'fas fa-play mr-2';
            text.textContent = isActive ? 'Aturar Música' : 'Reproduir Música';
        }
    },
    
    showScreen(screenName) { /* ... */ },
    logToActionPanel(message, level = 'info') { /* ... */ },
    toggleLogPanel() { /* ... */ },
    showHelpModal() { /* ... */ },
    hideHelpModal() { /* ... */ }
};
