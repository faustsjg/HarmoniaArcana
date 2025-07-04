export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev: null, carouselNext: null, apiKeyInput: null, saveApiKeyBtn: null,
  universeSelectionScreen: null, backToLandingBtn: null, changeApiKeyBtn: null,
  uploadScreen: null, uploadCombat: null, uploadCalma: null, uploadMisteri: null, uploadDoneBtn: null,
  sessionScreen: null, toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,

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
    if (versionDisplay) versionDisplay.textContent = `v${version}`;

    const apiStatus = byId('api-status');
    if (apiStatus) apiStatus.textContent = localStorage.getItem('harmoniaArcana_huggingFaceApiKey') ? 'Clau API detectada' : 'Sense clau API';

    if (this.changeApiKeyBtn) {
      this.changeApiKeyBtn.addEventListener('click', () => {
        localStorage.removeItem('harmoniaArcana_huggingFaceApiKey');
        this.showScreen('carousel-screen');
        this.updateStatus('Clau API eliminada');
      });
    }

    document.querySelectorAll('.universe-card').forEach(card => {
      card.addEventListener('click', () => {
        const was = card.classList.contains('expanded');
        document.querySelectorAll('.universe-card').forEach(c => {
          c.classList.remove('expanded');
          c.querySelector('.card-expanded')?.classList.add('hidden');
        });
        if (!was) {
          card.classList.add('expanded');
          card.querySelector('.card-expanded')?.classList.remove('hidden');
        }
      });
      const close = card.querySelector('.back-universe');
      close?.addEventListener('click', e => {
        e.stopPropagation();
        card.classList.remove('expanded');
        card.querySelector('.card-expanded')?.classList.add('hidden');
      });
    });

    if (this.toggleListeningBtn) {
      this.toggleListeningBtn.addEventListener('click', () => {
        const active = !this.toggleListeningBtn.classList.contains('active');
        this.toggleListeningBtn.classList.toggle('active', active);
        const i = this.toggleListeningBtn.querySelector('i');
        const span = this.toggleListeningBtn.querySelector('span');
        if (i) i.className = active ? 'fas fa-microphone' : 'fas fa-microphone-slash';
        if (span) span.textContent = active ? 'Escoltant' : 'Escoltar';
      });
    }

    if (this.stopMusicBtn) {
      this.stopMusicBtn.addEventListener('click', () => {
        const active = !this.stopMusicBtn.classList.contains('active');
        this.stopMusicBtn.classList.toggle('active', active);
        const i = this.stopMusicBtn.querySelector('i');
        const span = this.stopMusicBtn.querySelector('span');
        if (i) i.className = active ? 'fas fa-play' : 'fas fa-stop';
        if (span) span.textContent = active ? 'Reprodueix' : 'Atura música';
      });
    }
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  },

  updateStatus(message) {
    document.getElementById('status-display')?.textContent = message;
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
