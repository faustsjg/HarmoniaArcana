const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const Speech = {
  recognition: null, transcriptBuffer: "", isListening: false,
  init(onResult) {
    if (!SpeechRecognition) return alert("No soporto veu");
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ca-ES';
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.onresult = event => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; ++i)
        text += event.results[i][0].transcript;
      this.transcriptBuffer += text;
      onResult(this.transcriptBuffer);
    };
    this.recognition.onend = () => { if (this.isListening) this.recognition.start(); };
  },
  startListening() {
    this.init(() =>{});
    this.transcriptBuffer = ""; this.isListening = true;
    this.recognition.start();
  },
  stopListening() {
    this.isListening = false; this.recognition.stop();
  },
  getAndClearBuffer() {
    const b = this.transcriptBuffer;
    this.transcriptBuffer = "";
    return b;
  }
};
