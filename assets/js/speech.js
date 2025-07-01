const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const Speech = {
  recognition: null, transcriptBuffer:'', isListening:false,
  init(cb) {
    if (!SR) { alert("Reconeixement no suportat"); return false; }
    this.recognition = new SR();
    this.recognition.lang = 'ca-ES';
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.onresult = e => {
      let t=''; for (let i=e.resultIndex;i<e.results.length;++i) t += e.results[i][0].transcript;
      this.transcriptBuffer += t;
      cb(this.transcriptBuffer);
    };
    this.recognition.onend = () => this.isListening && this.recognition.start();
    return true;
  },
  startListening() {
    if (this.recognition && !this.isListening) {
      this.transcriptBuffer=''; this.isListening=true;
      this.recognition.start();
    }
  },
  stopListening() {
    if (this.recognition&&this.isListening) {
      this.isListening=false;
      this.recognition.stop();
    }
  },
  getAndClearBuffer() {
    const b=this.transcriptBuffer;
    this.transcriptBuffer='';
    return b;
  }
};
