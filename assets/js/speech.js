// FILE: assets/js/speech.js

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Speech = {
    recognition: null,
    transcriptBuffer: "",
    isListening: false,
    
    init(onNewText) {
        if (!SpeechRecognition) {
            console.error("El reconeixement de veu no és compatible amb aquest navegador.");
            alert("El reconeixement de veu no és compatible amb aquest navegador.");
            return false;
        }
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ca-ES';
        this.recognition.interimResults = false;
        this.recognition.continuous = true;

        this.recognition.onresult = (event) => {
            let newText = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                newText += event.results[i][0].transcript;
            }
            this.transcriptBuffer += newText + " ";
            onNewText(newText);
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                this.recognition.start();
            }
        };
        return true;
    },

    startListening() {
        if (this.recognition && !this.isListening) {
            this.transcriptBuffer = "";
            this.isListening = true;
            this.recognition.start();
            console.log("Speech: Escoltant...");
        }
    },

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
            console.log("Speech: Deixant d'escoltar.");
        }
    },

    getAndClearBuffer() {
        const buffer = this.transcriptBuffer;
        this.transcriptBuffer = "";
        return buffer;
    }
};
