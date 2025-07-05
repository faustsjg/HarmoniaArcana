export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev: null, carouselNext: null,
  apiKeyInput: null, saveApiKeyBtn: null,
  universeSelectionScreen: null, changeApiKeyBtn: null,
  uploadScreen: null, uploadCombat: null, uploadCalma: null, uploadMisteri: null, uploadDoneBtn: null,
  sessionScreen: null, toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,
  versionDisplay: null,

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
    this.versionDisplay = byId('version-display');

    if (this.versionDisplay) {
      this.versionDisplay.textContent = version;
    }

    this.landingStartBtn?.classList.remove('hidden');
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
  },

  updateStatus(message) {
    const status = document.getElementById('status-display');
    if (status) status.textContent = message;
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

  addLogEntry(msg) {
    const time = new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${time}]</span> ${msg}`;
    if (this.sessionLog) {
      this.sessionLog.appendChild(div);
      this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
    }
  }
};
