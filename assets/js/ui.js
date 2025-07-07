import { API_KEY_STORAGE_ID, APP_VERSION } from './config.js';

export const UI = {
  landingStartBtn: null,
  carouselPrev: null, carouselNext: null, saveApiKeyBtn: null,
  apiKeyInput: null, apiStatus: null,
  changeApiKeyBtn: null,
  toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,

  init() {
    this.landingStartBtn = document.getElementById('landing-start-btn');
    this.carouselPrev = document.getElementById('carousel-prev');
    this.carouselNext = document.getElementById('carousel-next');
    this.saveApiKeyBtn = document.getElementById('save-api-key-btn');
    this.apiKeyInput = document.getElementById('api-key-input');
    this.apiStatus = document.getElementById('api-status');
    this.changeApiKeyBtn = document.getElementById('change-api-key-btn');

    this.toggleListeningBtn = document.getElementById('toggle-listening-btn');
    this.stopMusicBtn = document.getElementById('stop-music-btn');
    this.stopSessionBtn = document.getElementById('stop-session-btn');
    this.transcriptPreview = document.getElementById('transcript-preview');
    this.musicStatusDot = document.getElementById('music-status-dot');
    this.musicStatusText = document.getElementById('music-status-text');
    this.sessionLog = document.getElementById('session-log');
    document.getElementById('version-display').textContent = APP_VERSION;

    const hasKey = !!localStorage.getItem(API_KEY_STORAGE_ID);
    this.apiStatus.textContent = hasKey ? 'Clau API detectada' : 'Sense clau API';
    this.apiStatus.style.color = hasKey ? '#10b981' : '#dc2626';
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  },

  updateMusicStatus(isPlaying, name = '') {
    this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
    this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
  },

  updateTranscript(text) {
    this.transcriptPreview.value = text;
    this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
  },

  addLogEntry(msg) {
    const time = new Date().toLocaleTimeString('ca-ES', {hour:'2-digit',minute:'2-digit'});
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${time}]</span> ${msg}`;
    this.sessionLog.appendChild(div);
    this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  }
};
