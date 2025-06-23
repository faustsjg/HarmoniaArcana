// FILE: assets/js/director.js
// ... (importacions)
export const Director = {
    // ... (propietats)
    async init(apiKey, inspiracio) {
        if (this.isSessionActive) return;
        this.isSessionActive = true;
        this.apiKey = apiKey;
        this.inspiracioMestra = inspiracio.trim() || "Música èpica d'aventures de fantasia";
        
        UI.showScreen('session-screen');
        UI.logToActionPanel("Sessió inicialitzada.", "success");
        UI.showHelpBtn.classList.remove('hidden'); // Mostrem el botó d'ajuda

        // Comença a sonar la música d'espera IMMEDIATAMENT
        AudioManager.playStandbyMusic();
        UI.updateMusicStatus(true, "Música d'espera");
        
        // En segon pla, generem el tema principal
        this.canviarMusicaPerContext({ mood: "tema principal", location: "inici de l'aventura", keywords: ["èpic"] });
        
        // ... (la resta de la inicialització de Speech)
    },
    // ... (la resta de funcions ara fan servir logToActionPanel)
};
