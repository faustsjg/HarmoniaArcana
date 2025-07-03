export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev:null, carouselNext:null, apiKeyInput:null, saveApiKeyBtn:null,
  universeScreen:null, backToLandingBtn:null,
  uploadScreen:null, uploadCombat:null, uploadCalma:null, uploadMisteri:null, uploadDoneBtn:null,
  sessionScreen:null, toggleListeningBtn:null, stopMusicBtn:null, stopSessionBtn:null,
  transcriptPreview:null, musicStatusDot:null, musicStatusText:null, sessionLog:null,
  soundButtons: {},

  init(version) {
    this.landingScreen = document.getElementById('landing-screen');
    this.landingStartBtn = document.getElementById('landing-start-btn');
    this.carouselScreen = document.getElementById('carousel-screen');
    this.carouselPrev = document.getElementById('carousel-prev');
    this.carouselNext = document.getElementById('carousel-next');
    this.apiKeyInput = document.getElementById('api-key-input');
    this.saveApiKeyBtn = document.getElementById('save-api-key-btn');
    this.universeScreen = document.getElementById('universe-selection-screen');
    this.backToLandingBtn = document.getElementById('back-to-landing-btn');
    this.uploadScreen = document.getElementById('upload-screen');
    this.uploadCombat = document.getElementById('upload-combat');
    this.uploadCalma = document.getElementById('upload-calma');
    this.uploadMisteri = document.getElementById('upload-misteri');
    this.uploadDoneBtn = document.getElementById('upload-done-btn');
    this.sessionScreen = document.getElementById('session-screen');
    this.toggleListeningBtn = document.getElementById('toggle-listening-btn');
    this.stopMusicBtn = document.getElementById('stop-music-btn');
    this.stopSessionBtn = document.getElementById('stop-session-btn');
    this.transcriptPreview = document.getElementById('transcript-preview');
    this.musicStatusDot = document.getElementById('music-status-dot');
    this.musicStatusText = document.getElementById('music-status-text');
    this.sessionLog = document.getElementById('session-log');

    // Efectes de so
    ['encanteri', 'espasa', 'llampec', 'misil', 'porta', 'rugit'].forEach(name => {
      const btn = document.getElementById(`sound-${name}`);
      if (btn) {
        this.soundButtons[name] = btn;
        btn.addEventListener('click', () => {
          import('./soundEffects.js').then(module => module.SoundEffects.play(name));
        });
      }
    });

    document.getElementById('version-display').textContent = `v${version}`;
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  updateStatus(message) {
    const el = document.getElementById('status-display');
    if (el) el.textContent = message;
  },

  updateTranscript(text) {
    if (this.transcriptPreview) {
      this.transcriptPreview.value = text;
    }
  },

  updateMusicStatus(isPlaying, name = '') {
    if (this.musicStatusDot)
      this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
    if (this.musicStatusText)
      this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
  },

  addLogEntry(msg) {
    const t = new Date().toLocaleTimeString('ca-ES', {hour:'2-digit',minute:'2-digit'});
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${t}]</span> ${msg}`;
    this.sessionLog.appendChild(div);
    this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  },

  toggleListeningBtnState(active) {
    this.toggleListeningBtn.classList.toggle('active', active);
    const i = this.toggleListeningBtn.querySelector('i');
    const span = this.toggleListeningBtn.querySelector('span');
    i.className = active ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    span.textContent = active ? 'Escoltant' : 'Escoltar';
  }
};
