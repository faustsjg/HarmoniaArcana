import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

const UNIVERSES = {
    "Fantasia Èpica Medieval": {
        description: "Orquestra, cors i melodies celtes.",
        tracks: {
            principal: './assets/sounds/tema_principal.mp3',
            combat: './assets/sounds/tema_combat.mp3',
        }
    },
    // ... altres universos aquí
    "El Teu Propi Univers": {
        description: "Puja les teves pròpies pistes per a cada ambient.",
        tracks: null // Indica que és personalitzat
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
    let selectedUniverse = null;

    function renderThemeCards() {
        if (!UI.themeCardsContainer) return;
        UI.themeCardsContainer.innerHTML = '';
        Object.keys(UNIVERSES).forEach(name => {
            const theme = UNIVERSES[name];
            const card = document.createElement('div');
            card.className = 'theme-card p-4 rounded-lg';
            card.innerHTML = `<h3 class="font-semibold text-white">${name}</h3><p class="text-sm text-gray-400">${theme.description}</p>`;
            card.addEventListener('click', () => {
                selectedUniverse = name;
                document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                if(UI.startSessionBtn) UI.startSessionBtn.disabled = false;
            });
            UI.themeCardsContainer.appendChild(card);
        });
    }

    function setupEventListeners() {
        if (UI.goToSetupBtn) UI.goToSetupBtn.addEventListener('click', () => {
            UI.showScreen('setup-screen');
            if (apiKey) {
                UI.apiKeyContainer.style.display = 'none';
                UI.themeSelectionContainer.style.display = 'block';
            } else {
                UI.apiKeyContainer.style.display = 'block';
                UI.themeSelectionContainer.style.display = 'none';
            }
        });

        if (UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                apiKey = keyInput;
                UI.apiKeyContainer.style.display = 'none';
                UI.themeSelectionContainer.style.display = 'block';
                alert("Clau API desada correctament!");
            } else { alert("Clau no vàlida."); }
        });

        if (UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            if (!selectedUniverse) { alert("Si us plau, selecciona un univers sonor."); return; }
            
            const inspiracio = selectedUniverse;
            const soundLibrary = UNIVERSES[selectedUniverse].tracks;
            
            // En el futur, si soundLibrary és null, aniríem a la pantalla de càrrega de fitxers.
            if (!soundLibrary) {
                alert("La càrrega de pistes personalitzades està en desenvolupament.");
                return;
            }

            apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) { UI.showScreen('api-key-screen'); return; }
            
            await AudioManager.init();
            Director.init(apiKey, inspiracio, soundLibrary);
        });
        
        // La resta de listeners es mantenen igual que a la v9.0.0
        if(UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => { /* ... */ });
        if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if(UI.toggleMusicBtn) UI.toggleMusicBtn.addEventListener('click', () => Director.toggleMusicPlayback());
        if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        if(UI.soundboard) UI.soundboard.addEventListener('click', (e) => { /* ... */ });
        if(UI.showHelpBtn) UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
        if(UI.closeHelpBtn) UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
        if(UI.timelineHeader) UI.timelineHeader.addEventListener('click', () => UI.toggleTimeline());
    }
    
    // --- INICI DE L'APP ---
    UI.showScreen('landing-screen');
    renderThemeCards();
    setupEventListeners();
});