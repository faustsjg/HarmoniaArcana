import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

const UNIVERSES = {
    "Fantasia Èpica Medieval": {
        description: "Orquestra, cors i melodies celtes per a aventures grandioses.",
        tracks: {
            principal: './assets/sounds/tema_principal.mp3',
            combat: './assets/sounds/tema_combat.mp3'
        }
    },
    "Aventura JRPG Clàssica": {
        description: "Aquesta funció està en desenvolupament.",
        tracks: null
    },
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
                    alert("Aquest univers sonor està en desenvolupament i encara no està disponible.");
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
        UI.goToSetupBtn.addEventListener('click', () => {
            UI.showScreen('setup-screen');
            if (apiKey) {
                UI.apiKeyContainer.style.display = 'none';
            } else {
                UI.apiKeyContainer.style.display = 'block';
            }
        });

        UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                apiKey = keyInput;
                UI.apiKeyContainer.style.display = 'none';
                alert("Clau API desada correctament!");
            } else { alert("Clau no vàlida."); }
        });
        
        UI.changeApiKeyBtn.addEventListener('click', () => {
            if (confirm("Vols esborrar la teva API Key?")) {
                localStorage.removeItem(API_KEY_STORAGE_ID);
                window.location.reload();
            }
        });

        UI.startSessionBtn.addEventListener('click', async () => {
            if (!selectedUniverse) { alert("Si us plau, selecciona un univers sonor."); return; }
            
            const inspiracio = selectedUniverse;
            const soundLibrary = UNIVERSES[selectedUniverse].tracks;

            apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) { UI.showScreen('api-key-screen'); return; }
            
            await AudioManager.init();
            Director.init(apiKey, inspiracio, soundLibrary);
        });

        UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        UI.toggleMusicBtn.addEventListener('click', () => Director.toggleMusicPlayback());
        UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        if(UI.soundboard) UI.soundboard.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.sound) AudioManager.playSoundEffect(button.dataset.sound);
        });

        UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
        UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
        if(UI.toggleLogBtn) UI.toggleLogBtn.addEventListener('click', () => UI.toggleLogPanel());
    }
    
    // --- INICI DE L'APP ---
    UI.showScreen('landing-screen');
    renderThemeCards();
    setupEventListeners();
});