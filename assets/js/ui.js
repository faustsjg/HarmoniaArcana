import { APP_VERSION, API_KEY_STORAGE_ID, INSTALL_STEPS } from './config.js';

export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev: null, carouselNext: null,
  apiKeyInput: null, saveApiKeyBtn: null,
  universeSelectionScreen: null, backToLandingBtn: null, changeApiKeyBtn: null,
  uploadScreen: null, uploadCombat: null, uploadCalma: null, uploadMisteri: null, uploadDoneBtn: null,
  sessionScreen: null, toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,
  carouselSteps: INSTALL_STEPS, currentStep: 0,

  init(version) {
    const byId = id => document.getElementById(id);

    this.landingScreen = byId('landing-screen');
    this.landingStartBtn = byId('landing-start-btn');
    this.carouselScreen = byId('carousel-screen');
    this.carouselPrev = byId('carousel-prev');
    this.carouselNext = byId('carousel-next');
    this.apiKeyInput = byId('api-key-input');
    this.saveApiKeyBtn = byId('save-api-key-btn');
    this.universeSelectionScreen = byId('universe-selection-screen');
    this.backToLandingBtn = byId('back-to-landing-btn');
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

    const versionDisplay = byId('version-display');
    if (versionDisplay) versionDisplay.textContent = version;

    const apiStatus = byId('api-status');
    if (apiStatus) apiStatus.textContent = localStorage.getItem(API_KEY_STORAGE_ID) ? 'Clau API detectada' : 'Sense clau API';

    this.carouselPrev?.addEventListener('click', () => this.showStep(this.currentStep - 1));
    this.carouselNext?.addEventListener('click', () => this.showStep(this.currentStep + 1));

    this.changeApiKeyBtn?.addEventListener('click', () => {
      localStorage.removeItem(API_KEY_STORAGE_ID);
      this.showScreen('carousel-screen');
      this.updateStatus('Clau API eliminada');
    });

    this.showStep(0);
  },

  showStep(idx) {
    if (idx < 0 || idx >= this.carouselSteps.length) return;
    this.currentStep = idx;

    const step = this.carouselSteps[idx];
    const titleEl = document.getElementById('step-title');
    const descEl = document.getElementById('step-desc');
    const linkEl = document.getElementById('step-link');

    titleEl.textContent = step.title;
    descEl.textContent = step.desc;

    if (step.link) {
      linkEl.textContent = 'Anar al pas';
      linkEl.href = step.link;
      linkEl.classList.remove('hidden');
    } else {
      linkEl.classList.add('hidden');
    }

    this.carouselPrev.disabled = idx === 0;
    this.carouselNext.disabled = idx === this.carouselSteps.length - 1;
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  },

  updateStatus(message) {
    const el = document.getElementById('status-display');
    if (el) el.textContent = message;
  },

  updateTranscript(text) {
    if (this.transcriptPreview) {
      this.transcriptPreview.value = text;
      this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
    }
  },

  updateMusicStatus(isPlaying, name = '') {
    if (this.musicStatusDot) this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
    if (this.musicStatusText) this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
  },

  addLogEntry(message) {
    const time = new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${time}]</span> ${message}`;
    this.sessionLog?.appendChild(div);
    if (this.sessionLog) this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  }
};
