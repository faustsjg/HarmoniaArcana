// FILE: assets/js/main.js
// ... (importacions)
document.addEventListener('DOMContentLoaded', () => {
    // ... (lògica inicial)
    // Afegim els nous listeners
    if (UI.showHelpBtn) UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
    if (UI.closeHelpBtn) UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
    if (UI.toggleLogBtn) UI.toggleLogBtn.addEventListener('click', () => UI.toggleLogPanel());
    // ... (la resta de listeners es mantenen)
});
