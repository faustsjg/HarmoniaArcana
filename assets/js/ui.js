import { APP_VERSION, API_KEY_STORAGE_ID } from './config.js';

export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev: null, carouselNext: null, apiKeyInput: null, saveApiKeyBtn: null,
  universeSelectionScreen: null, changeApiKeyBtn: null,
  uploadScreen: null, uploadCombat: null, uploadCalma: null, uploadMisteri: null, uploadDoneBtn: null,
  sessionScreen: null, toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,
  effectButtons: null,

  init() {
    const byId = id => document.getElementById(id);
    this.landingScreen = byId('landing-screen');
    this.landingStartBtn = byId('landing-start-btn');
    this.carouselScreen = byId('carousel-screen');
    this.carouselPrev = byId('carousel-prev');
    this.carouselNext = byId('carousel-next');
    this.apiKeyInput = byId('api-key-input');
    this.saveApiKeyBtn = byId('save-api-key-btn');
    this.universeSelectionScreen = byId('universe-selection-screen');
    this.changeApiKeyBtn = byId('change-api-key-btn');
    this.uploadScreen = byId('upload-screen');
    this.uploadCombat = byId('upload-combat');
    this.uploadCalma = byId('upload-calma');
    this.uploadMisteri = byId('upload-misteri');
    this.uploadDoneBtn = byId('upload-done-btn');
    this.sessionScreen = byId('session-screen');
    this.toggleListeningBtn = byId('toggle-listening-btn');
    this.stopMusicBtn = byId('stop-music-btn');
    this.stopSessionBtn = byId('stop-session-btn');
    this.transcriptPreview = byId('transcript-preview');
    this.musicStatusDot = byId('music-status-dot');
    this.musicStatusText = byId('music-status-text');
    this.sessionLog = byId('session-log');
    this.effectButtons = document.querySelectorAll('#effect-buttons button');

    byId('version-display').textContent = APP_VERSION;

    this.toggleListeningBtn.style.display = 'none';
    this.stopMusicBtn.style.display = 'none';
    this.stopSessionBtn.style.display = 'none';

    this.landingStartBtn.addEventListener('click', () => {
      this.showScreen('carousel-screen');
    });

    this.carouselPrev.addEventListener('click', () => {});
    this.carouselNext.addEventListener('click', () => {
      this.carouselPrev.disabled = false;
    });
    this.saveApiKeyBtn.addEventListener('click', () => {});

    this.changeApiKeyBtn.addEventListener('click', () => {
      localStorage.removeItem(API_KEY_STORAGE_ID);
      this.showScreen('carousel-screen');
    });

    document.querySelectorAll('.universe-card').forEach(card => {
      card.addEventListener('click', () => {});
    });

    this.uploadDoneBtn.addEventListener('click', () => {});

    this.toggleListeningBtn.addEventListener('click', () => {});
    this.stopMusicBtn.addEventListener('click', () => {});
    this.stopSessionBtn.addEventListener('click', () => {});
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');

    const sess = id === 'session-screen';
    this.toggleListeningBtn.style.display = sess ? 'inline-block' : 'none';
    this.stopMusicBtn.style.display = sess ? 'inline-block' : 'none';
    this.stopSessionBtn.style.display = sess ? 'inline-block' : 'none';
  },

  updateStatus(message) {
    const st = document.getElementById('api-status');
    if (st) st.textContent = message;
  },

  updateTranscript(text) {
    if (this.transcriptPreview) {
      this.transcriptPreview.value = text;
      this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
    }
  },

  updateMusicStatus(isPlaying, name = '') {
    this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
    this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
  },

  addLogEntry(message) {
    const time = new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${time}]</span> ${message}`;
    this.sessionLog.appendChild(div);
    this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  }
};