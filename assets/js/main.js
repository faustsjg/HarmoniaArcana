// FILE: assets/js/main.js
import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';
import { UI } from './ui.js';

const UNIVERSES = {
    "Fantasia Èpica Medieval": {
        description: "Orquestra, cors i melodies celtes.",
        required_tracks: ['principal', 'combat', 'tensio']
    },
    "Aventura JRPG Clàssica": {
        description: "Rock orquestral, piano i melodies heroiques.",
        required_tracks: null // Marcat com a no disponible
    },
    "El Teu Propi Univers": {
        description: "Puja les teves pròpies pistes per a cada ambient.",
        required_tracks: ['principal', 'combat', 'exploracio', 'misteri']
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    UI.init(APP_VERSION);
    let apiKey = localStorage.getItem(API_KEY_STORAGE_ID);
    let selectedUniverse = null;
    let uploadedTracks = {};

    function renderThemeCards() {
        if (!UI.themeCardsContainer) return;
        UI.themeCardsContainer.innerHTML = '';
        Object.keys(UNIVERSES).forEach(name => {
            const theme = UNIVERSES[name];
            const card = document.createElement('div');
            card.className = 'theme-card p-4 rounded-lg';
            card.innerHTML = `<h3 class="font-semibold text-white">${name}</h3><p class="text-sm text-gray-400">${theme.description}</p>`;
            
            card.addEventListener('click', () => {
                if (!theme.required_tracks) {
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

    function checkAllTracksUploaded() {
        if (!selectedUniverse) return false;
        const required = UNIVERSES[selectedUniverse].required_tracks;
        const uploaded = Object.keys(uploadedTracks);
        return required.every(track => uploaded.includes(track));
    }

    function renderTrackUploadUI() {
        if (!UI.trackUploadList || !selectedUniverse) return;
        const theme = UNIVERSES[selectedUniverse];
        UI.prepTitle.textContent = `Preparant: ${selectedUniverse}`;
        UI.trackUploadList.innerHTML = '';
        
        theme.required_tracks.forEach(trackName => {
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center bg-gray-700 p-3 rounded-lg';
            const inputId = `upload-${trackName}`;
            row.innerHTML = `
                <span class="text-gray-300">${trackName.replace(/^\w/, c => c.toUpperCase())}</span>
                <div>
                    <span id="status-${trackName}" class="text-xs text-red-400 mr-4">Pendent</span>
                    <label for="${inputId}" class="btn-action-secondary px-3 py-1 rounded-md cursor-pointer text-sm">
                        Puja MP3
                    </label>
                    <input type="file" id="${inputId}" class="hidden" accept=".mp3">
                </div>
            `;
            UI.trackUploadList.appendChild(row);
            
            document.getElementById(inputId).addEventListener('change', (event) => {
                const file = event.target.files[0];
                if(file) {
                    uploadedTracks[trackName] = file;
                    document.getElementById(`status-${trackName}`).textContent = 'Carregat';
                    document.getElementById(`status-${trackName}`).classList.replace('text-red-400', 'text-green-400');
                    if(checkAllTracksUploaded()) {
                        UI.playSessionBtn.disabled = false;
                    }
                }
            });
        });
    }

    function setupEventListeners() {
        if (UI.goToSetupBtn) UI.goToSetupBtn.addEventListener('click', () => {
            UI.showScreen('setup-screen');
            if (apiKey) {
                UI.apiKeyContainer.style.display = 'none';
            } else {
                UI.apiKeyContainer.style.display = 'block';
            }
        });

        if (UI.backToLandingBtn) UI.backToLandingBtn.addEventListener('click', () => UI.showScreen('landing-screen'));

        if (UI.saveApiKeyBtn) UI.saveApiKeyBtn.addEventListener('click', () => {
            const keyInput = UI.apiKeyInput.value.trim();
            if (keyInput.startsWith('hf_')) {
                localStorage.setItem(API_KEY_STORAGE_ID, keyInput);
                apiKey = keyInput;
                UI.apiKeyContainer.style.display = 'none';
            } else { alert("Clau no vàlida."); }
        });

        if (UI.startSessionBtn) UI.startSessionBtn.addEventListener('click', () => {
            if (!selectedUniverse) { alert("Si us plau, selecciona un univers sonor."); return; }
            UI.showScreen('track-prep-screen');
            renderTrackUploadUI();
        });

        if (UI.playSessionBtn) UI.playSessionBtn.addEventListener('click', async () => {
             await AudioManager.init();
             Director.init(apiKey, selectedUniverse, uploadedTracks);
        });

        if (UI.changeApiKeyBtn) UI.changeApiKeyBtn.addEventListener('click', () => {
            if (confirm("Vols esborrar la teva API Key?")) {
                localStorage.removeItem(API_KEY_STORAGE_ID);
                window.location.reload();
            }
        });

        if (UI.timelineHeader) UI.timelineHeader.addEventListener('click', () => UI.toggleTimeline());
    }
    
    renderThemeCards();
    setupEventListeners();
    UI.showScreen('landing-screen');
});