export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev: null, carouselNext: null, apiKeyInput: null, saveApiKeyBtn: null,
  universeSelectionScreen: null, uploadScreen: null, sessionScreen: null,
  uploadCombat: null, uploadCalma: null, uploadMisteri: null, uploadDoneBtn: null,
  toggleListeningBtn: null, stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null, musicStatusText: null, sessionLog: null,
  backUniversityBtn: null,

  init(version) {
    this.landingScreen = document.getElementById('landing-screen');
    this.landingStartBtn = document.getElementById('landing-start-btn');

    this.carouselScreen = document.getElementById('carousel-screen');
    this.carouselPrev = document.getElementById('carousel-prev');
    this.carouselNext = document.getElementById('carousel-next');
    this.apiKeyInput = document.getElementById('api-key-input');
    this.saveApiKeyBtn = document.getElementById('save-api-key-btn');

    this.universeSelectionScreen = document.getElementById('universe-selection-screen');

    this.uploadScreen = document.getElementById('upload-screen');
    this.uploadCombat = document.getElementById('upload-combat');
    this.uploadCalma = document.getElementById('upload-calma');
    this.uploadMisteri = document.getElementById('upload-misteri');
    this.uploadDoneBtn = document.getElementById('upload-done-btn');
    this.backUniversityBtn = document.getElementById('back-university-btn');

    this.sessionScreen = document.getElementById('session-screen');
    this.toggleListeningBtn = document.getElementById('toggle-listening-btn');
    this.stopMusicBtn = document.getElementById('stop-music-btn');
    this.stopSessionBtn = document.getElementById('stop-session-btn');
    this.transcriptPreview = document.getElementById('transcript-preview');
    this.musicStatusDot = document.getElementById('music-status-dot');
    this.musicStatusText = document.getElementById('music-status-text');
    this.sessionLog = document.getElementById('session-log');

    document.querySelectorAll('.universe-card').forEach(card => {
      card.addEventListener('click', () => {
        const wasExpanded = card.classList.contains('expanded');
        document.querySelectorAll('.universe-card').forEach(c => {
          c.classList.remove('expanded');
          c.querySelector('.card-expanded').classList.add('hidden');
        });
        if (!wasExpanded) {
          card.classList.add('expanded');
          card.querySelector('.card-expanded').classList.remove('hidden');
        }
      });
      card.querySelector('.back-universe').addEventListener('click', e => {
        e.stopPropagation();
        card.classList.remove('expanded');
        card.querySelector('.card-expanded').classList.add('hidden');
      });
    });

    if (document.getElementById('carousel')) {
      this.carouselPrev.addEventListener('click', () => shiftCarousel(-1));
      this.carouselNext.addEventListener('click', () => shiftCarousel(1));
    }

    // text-control buttons
    this.toggleListeningBtn.querySelector('i').classList.add('fa-microphone-slash');
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  updateTranscript(text) {
    this.transcriptPreview.value = text;
  },

  updateMusicStatus(isPlaying, name='') {
    this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280';
    this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada';
  },

  addLogEntry(msg) {
    const time = new Date().toLocaleTimeString('ca-ES', {hour: '2-digit', minute: '2-digit'});
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${time}]</span> ${msg}`;
    this.sessionLog.appendChild(div);
    this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  },

  toggleListeningBtnState(active) {
    this.toggleListeningBtn.classList.toggle('active', active);
    this.toggleListeningBtn.querySelector('i').className = active ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    this.toggleListeningBtn.querySelector('span').textContent = active ? 'Escoltant' : 'Escoltar';
  }
};

// Carrusel logic
let carouselIndex = 0;
function shiftCarousel(dir) {
  const slides = document.querySelectorAll('#carousel .slide');
  carouselIndex = (carouselIndex + dir + slides.length) % slides.length;
  document.querySelector('.carousel-slides').style.transform = `translateX(-${carouselIndex * 100}%)`;
}
