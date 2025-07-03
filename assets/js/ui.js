export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev: null, carouselNext: null, apiKeyInput: null, saveApiKeyBtn: null,
  universeSelectionScreen: null, backToLandingBtn: null,
  uploadScreen: null, uploadCombat: null, uploadCalma: null, uploadMisteri: null, uploadDoneBtn: null,
  sessionScreen: null, toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,
  soundButtons: {},

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

    ['encanteri', 'espasa', 'llampec', 'misil', 'porta', 'rugit'].forEach(name => {
      const btn = byId(`sound-${name}`);
      if (btn) {
        this.soundButtons[name] = btn;
        btn.addEventListener('click', () => {
          import('./soundEffects.js').then(module => module.SoundEffects.play(name));
        });
      }
    });

    let index = 0;
    const slides = document.querySelectorAll('#carousel .slide');
    const container = document.querySelector('.carousel-slides');
    this.carouselPrev?.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      container.style.transform = `translateX(-${index * 100}%)`;
    });
    this.carouselNext?.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      container.style.transform = `translateX(-${index * 100}%)`;
    });

    document.querySelectorAll('.universe-card').forEach(card => {
      card.addEventListener('click', () => {
        const already = card.classList.contains('expanded');
        document.querySelectorAll('.universe-card').forEach(c => {
          c.classList.remove('expanded');
          c.querySelector('.card-expanded').classList.add('hidden');
        });
        if (!already) {
          card.classList.add('expanded');
          card.querySelector('.card-expanded').classList.remove('hidden');
        }
      });
      const closeBtn = card.querySelector('.back-universe');
      closeBtn?.addEventListener('click', e => {
        e.stopPropagation();
        card.classList.remove('expanded');
        card.querySelector('.card-expanded').classList.add('hidden');
      });
    });
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  },

  updateStatus(msg) {
    document.getElementById('status-display')?.textContent = msg;
  },

  updateTranscript(text) {
    if (this.transcriptPreview) {
      this.transcriptPreview.value = text;
      this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
    }
  },

  updateMusicStatus(isPlaying, name='') {
    this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
    this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
  },

  addLogEntry(msg) {
    const time = new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${time}]</span> ${msg}`;
    this.sessionLog?.appendChild(div);
    this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  },

  toggleListeningBtnState(active) {
    this.toggleListeningBtn.classList.toggle('active', active);
    const i = this.toggleListeningBtn.querySelector('i');
    const span = this.toggleListeningBtn.querySelector('span');
    if (i) i.className = active ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    if (span) span.textContent = active ? 'Escoltant' : 'Escoltar';
  }
};