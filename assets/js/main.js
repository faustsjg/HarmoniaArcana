import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';
import { AudioManager } from './audioManager.js';
import { Director } from './director.js';

const UNIVERSES = {
    "Fantasia Èpica Medieval": {
        description: "Orquestra, cors i melodies celtes.",
        image: "url_a_la_teva_imatge_fantasia.jpg",
        tracks: { principal: './assets/sounds/tema_principal.mp3', combat: './assets/sounds/tema_combat.mp3' }
    },
    "Aventura JRPG Clàssica": {
        description: "Rock orquestral, piano i melodies heroiques.",
        image: "url_a_la_teva_imatge_jrpg.jpg",
        tracks: null
    },
    "Cyberpunk Noir": {
        description: "Sintetitzadors foscos i ritmes electrònics.",
        image: "url_a_la_teva_imatge_cyberpunk.jpg",
        tracks: null
    },
    "Terror Còsmic": {
        description: "Ambients sonors dissonants i inquietants.",
        image: "url_a_la_teva_imatge_horror.jpg",
        tracks: null
    },
    "El Teu Propi Univers": {
        description: "Puja les teves pròpies pistes per a cada ambient.",
        image: "url_a_la_teva_imatge_custom.jpg",
        tracks: "custom" 
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
            card.className = 'theme-card';
            card.innerHTML = `<div class="theme-overlay"></div><h3 class="theme-name">${name}</h3><p class="theme-description">${theme.description}</p>`;
            
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
                UI.startSessionBtn.disabled = true;
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
                alert("Clau API desada correctament!");
            } else { alert("Clau no vàlida."); }
        });

        if (UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', async () => {
            if (!selectedUniverse) { alert("Si us plau, selecciona un univers sonor."); return; }
            
            const soundLibrary = UNIVERSES[selectedUniverse].tracks;
            if (soundLibrary === "custom") {
                alert("La càrrega de pistes personalitzades està en desenvolupament.");
                return;
            }

            apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
            if (!apiKey) { UI.showScreen('api-key-screen'); return; }
            
            await AudioManager.init();
            Director.init(apiKey, selectedUniverse, soundLibrary);
        });

        if (UI.toggleListeningBtn) UI.toggleListeningBtn.addEventListener('click', () => Director.toggleListening());
        if (UI.toggleMusicBtn) UI.toggleMusicBtn.addEventListener('click', () => Director.toggleMusicPlayback());
        if (UI.stopSessionBtn) UI.stopSessionBtn.addEventListener('click', () => Director.aturarSessio());
        if (UI.soundboard) UI.soundboard.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.sound) AudioManager.playSoundEffect(button.dataset.sound);
        });

        if (UI.showHelpBtn) UI.showHelpBtn.addEventListener('click', () => UI.showHelpModal());
        if (UI.closeHelpBtn) UI.closeHelpBtn.addEventListener('click', () => UI.hideHelpModal());
        if (UI.toggleLogBtn) UI.toggleLogBtn.addEventListener('click', () => UI.toggleLogPanel());
        if (UI.helpModalOverlay) UI.helpModalOverlay.addEventListener('click', (e) => { if (e.target === UI.helpModalOverlay) UI.hideHelpModal(); });
    }
    
    renderThemeCards();
    setupEventListeners();
    UI.showScreen('landing-screen');
});