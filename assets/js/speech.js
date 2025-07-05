const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Speech = {
  recognition: null,
  transcript: '',
  isListening: false,

  init(callback) {
    if (!SpeechRecognition) return alert('No compatible');
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ca-ES';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = e => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      this.transcript += text;
      callback(this.transcript);
    };
    this.recognition.onend = () => {
      if (this.isListening) this.recognition.start();
    };
  },

  startListening() {
    if (this.recognition && !this.isListening) {
      this.transcript = '';
      this.isListening = true;
      this.recognition.start();
    }
  },

  stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  },

  getAndClearBuffer() {
    const text = this.transcript;
    this.transcript = '';
    return text;
  }
};
