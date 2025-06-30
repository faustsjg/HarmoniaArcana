// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

const THEMES = {
    "Fantasia Èpica Medieval": {
        description: "Orquestra, cors i melodies celtes.",
        tracks: {
            principal: './assets/sounds/lotr_main_theme.mp3',
            combat: './assets/sounds/lotr_combat_theme.mp3',
            tensio: './assets/sounds/lotr_tension_theme.mp3',
        }
    },
    "Aventura JRPG Clàssica": {
        description: "Rock orquestral, piano i melodies heroiques.",
        tracks: {
            principal: './assets/sounds/jrpg_main_theme.mp3',
            combat: './assets/sounds/jrpg_battle_theme.mp3',
            tensio: './assets/sounds/jrpg_dungeon_theme.mp3',
        }
    },
    "El Teu Propi Univers": {
        description: "Puja les teves pròpies pistes per a cada ambient.",
        tracks: {} // L'usuari les ha de pujar
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
    let selectedTheme = null;

    function renderThemeCards() {
        if (!UI.themeCardsContainer) return;
        UI.themeCardsContainer.innerHTML = '';
        Object.keys(THEMES).forEach(themeName => {
            const theme = THEMES[themeName];
            const card = document.createElement('div');
            card.className = 'theme-card p-4 rounded-lg border-2 border-transparent cursor-pointer';
            card.innerHTML = `<h3 class="font-semibold text-white">${themeName}</h3><p class="text-sm text-gray-400">${theme.description}</p>`;
            card.addEventListener('click', () => {
                selectedTheme = themeName;
                document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                UI.startSessionBtn.disabled = false;
            });
            UI.themeCardsContainer.appendChild(card);
        });
    }

    function setupEventListeners() {
        document.getElementById('start-onboarding-btn').addEventListener('click', () => {
            UI.showScreen(apiKey ? 'setup-screen' : 'api-key-screen');
        });

        UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                apiKey = keyInput;
                UI.apiKeyContainer.style.display = 'none';
                UI.themeSelectionContainer.style.display = 'block';
            } else { alert("La clau de l'API no és vàlida."); }
        });

        UI.startSessionBtn.addEventListener('click', async () => {
            const inspiracio = UI.masterInspirationInput.value || selectedTheme;
            if (!inspiracio) { alert("Si us plau, selecciona un tema."); return; }
            await AudioManager.init();
            Director.init(apiKey, inspiracio, THEMES[selectedTheme].tracks);
        });

        // La resta de listeners...
        if(UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if(UI.toggleMusicBtn) UI.toggleMusicBtn.addEventListener('click', () => Director.toggleMusicPlayback());
        if(UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        if(UI.showHelpBtn) UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
        if(UI.closeHelpBtn) UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
        if(UI.timelineHeader) UI.timelineHeader.addEventListener('click', () => UI.toggleTimeline());
    }
    
    // --- LÒGICA D'INICI ---
    UI.showScreen('landing-screen');
    renderThemeCards();
    setupEventListeners();
    
    if (apiKey) {
        UI.apiKeyContainer.style.display = 'none';
        UI.themeSelectionContainer.style.display = 'block';
    } else {
        UI.apiKeyContainer.style.display = 'block';
        UI.themeSelectionContainer.style.display = 'none';
        UI.startSessionBtn.disabled = true;
    }
});
