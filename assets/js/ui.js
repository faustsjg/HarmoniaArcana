export const UI = {
  statusDisplay: null, versionDisplay: null,
  landingScreen: null, apiKeyScreen: null, universeSelectionScreen: null,
  uploadScreen: null, setupScreen: null, sessionScreen: null,
  landingStartBtn: null, saveApiKeyBtn: null, changeApiKeyBtn: null,
  startSessionBtn: null, toggleListeningBtn: null,
  stopMusicBtn: null, stopSessionBtn: null,
  transcriptPreview: null, musicStatusDot: null,
  musicStatusText: null, sessionLog: null,
  uploadDoneBtn: null,

  init(version) {
    [
      'status-display','version-display',
      'landing-screen','landing-start-btn',
      'api-key-screen','save-api-key-btn','api-key-input',
      'universe-selection-screen',
      'upload-screen','upload-combat','upload-calma','upload-misteri','upload-done-btn',
      'setup-screen','start-session-btn','change-api-key-btn',
      'session-screen','toggle-listening-btn','stop-music-btn','stop-session-btn',
      'transcript-preview','music-status-dot','music-status-text','session-log'
    ].forEach(id => {
      const prop = id.replace(/-(\w)/g, (_,c)=>c.toUpperCase());
      this[prop] = document.getElementById(id);
    });
    this.versionDisplay && (this.versionDisplay.textContent = `Harmonia Arcana ${version}`);
  },

  updateStatus(msg) {
    this.statusDisplay && (this.statusDisplay.textContent = msg);
  },

  updateMusicStatus(isPlaying, name='') {
    this.musicStatusDot && (this.musicStatusDot.style.backgroundColor = isPlaying ? '#10b981' : '#6b7280');
    this.musicStatusText && (this.musicStatusText.textContent = isPlaying ? `Reproduint: ${name}` : 'Aturada');
  },

  updateTranscript(text) {
    if (!this.transcriptPreview) return;
    this.transcriptPreview.textContent = text;
    this.transcriptPreview.scrollTop = this.transcriptPreview.scrollHeight;
  },

  addLogEntry(msg) {
    if (!this.sessionLog) return;
    const t = new Date().toLocaleTimeString('ca-ES',{hour:'2-digit',minute:'2-digit'});
    const div = document.createElement('div');
    div.className = 'mb-1';
    div.innerHTML = `<span class="text-purple-400">[${t}]</span> ${msg}`;
    this.sessionLog.appendChild(div);
    this.sessionLog.scrollTop = this.sessionLog.scrollHeight;
  },

  showScreen(id) {
    ['landing-screen','api-key-screen','universe-selection-screen','upload-screen','setup-screen','session-screen'].forEach(s => {
      document.getElementById(s).style.display = (s === id) ? 'block' : 'none';
    });
  },

  setButtonActive(btn, active) {
    if (!btn) return;
    btn.classList.toggle('active',active);
    const icon = btn.querySelector('i'), txt = btn.querySelector('span');
    if (btn.id === 'toggle-listening-btn') {
      icon.className = active? 'fas fa-microphone mr-2':'fas fa-microphone-slash mr-2';
      txt.textContent = active? 'Escoltant':'Escoltar';
    }
  }
};
