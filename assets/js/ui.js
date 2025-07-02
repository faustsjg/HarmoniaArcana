export const UI = {
  landingScreen: null, landingStartBtn: null,
  carouselScreen: null, carouselPrev:null, carouselNext:null, apiKeyInput:null, saveApiKeyBtn:null,
  universeScreen:null, backToLandingBtn:null,
  uploadScreen:null, uploadCombat:null, uploadCalma:null, uploadMisteri:null, uploadDoneBtn:null,
  sessionScreen:null, toggleListeningBtn:null, stopMusicBtn:null, stopSessionBtn:null,
  transcriptPreview:null, musicStatusDot:null, musicStatusText:null, sessionLog:null,

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

    this.toggleListeningBtn.querySelector('i').className = 'fas fa-microphone-slash';
    document.querySelectorAll('.universe-card').forEach(card => {
      card.addEventListener('click', () => {
        const was = card.classList.contains('expanded');
        document.querySelectorAll('.universe-card').forEach(c => {
          c.classList.remove('expanded');
          c.querySelector('.card-expanded').classList.add('hidden');
        });
        if (!was) {
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

    let carouselIndex = 0;
    const slides = document.querySelectorAll('#carousel .slide');
    const container = document.querySelector('.carousel-slides');
    this.carouselPrev.addEventListener('click', () => {
      carouselIndex = (carouselIndex -1 + slides.length)%slides.length;
      container.style.transform = `translateX(-${carouselIndex * 100}%)`;
    });
    this.carouselNext.addEventListener('click', () => {
      carouselIndex = (carouselIndex +1)%slides.length;
      container.style.transform = `translateX(-${carouselIndex * 100}%)`;
    });

    document.getElementById('version-display').textContent = `v${version}`;
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  updateTranscript(text) { this.transcriptPreview.value = text; },
  updateMusicStatus(isPlaying,name=''){ this.musicStatusDot.style.backgroundColor = isPlaying?'#10b981':'#6b7280'; this.musicStatusText.textContent = isPlaying?`Reproduint: ${name}`:'Aturada'; },

  addLogEntry(msg){
    const t = new Date().toLocaleTimeString('ca-ES',{hour:'2-digit',minute:'2-digit'});
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-purple-400">[${t}]</span> ${msg}`;
    this.sessionLog.appendChild(div); this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  },

  toggleListeningBtnState(active) {
    this.toggleListeningBtn.classList.toggle('active',active);
    const i = this.toggleListeningBtn.querySelector('i');
    const span = this.toggleListeningBtn.querySelector('span');
    i.className = active ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    span.textContent = active ? 'Escoltant' : 'Escoltar';
  }
};
