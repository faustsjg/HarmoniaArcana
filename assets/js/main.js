// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

const UNIVERSES = {
    "Fantasia Èpica Medieval": {
        description: "Orquestra, cors i melodies celtes.",
        tracks: { principal: './assets/sounds/tema_principal.mp3', combat: './assets/sounds/tema_combat.mp3' }
    },
    "Aventura JRPG Clàssica": {
        description: "Rock orquestral i melodies heroiques.",
        tracks: null // Marcat com a no disponible
    },
    "Cyberpunk Noir": {
        description: "Sintetitzadors foscos i ritmes electrònics.",
        tracks: null
    },
    "Terror Còsmic": {
        description: "Ambients sonors dissonants i inquietants.",
        tracks: null
    },
    "El Teu Propi Univers": {
        description: "Puja les teves pròpies pistes per a cada ambient.",
        tracks: null 
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
                if (!theme.tracks) {
                    alert("Aquest univers sonor està en desenvolupament.");
                    return;
                }
                selectedUniverse = name;
                document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                UI.startSessionBtn.disabled = false;
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

        if (UI.backToLandingBtn) UI.backToLandingBtn.addEventListener('click', () => UI.showScreen('landing-screen'));

        if (UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                apiKey = keyInput;
                UI.apiKeyContainer.style.display = 'none';
                UI.themeSelectionContainer.style.display = 'block';
            } else { alert("Clau no vàlida."); }
        });

        if (UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            if (!selectedUniverse) { return; }
            const soundLibrary = UNIVERSES[selectedUniverse].tracks;
            await AudioManager.init();
            Director.init(apiKey, selectedUniverse, soundLibrary);
        });
        
        if (UI.timelineHeader) UI.timelineHeader.addEventListener('click', () => UI.toggleTimeline());
        if (UI.toggleLogBtn) UI.toggleLogBtn.addEventListener('click', () => UI.toggleLogPanel());
    }
    
    // --- INICI DE L'APP ---
    UI.showScreen('landing-screen');
    renderThemeCards();
    setupEventListeners();
});