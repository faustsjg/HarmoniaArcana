// FILE: assets/js/speech.js
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Speech = {
    recognition: null,
    transcriptBuffer: "",
    isListening: false,
    
    init(onResult, onFinalResult) {
        if (!SpeechRecognition) return false;
        
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ca-ES';
        this.recognition.interimResults = true; // <-- CANVI CLAU
        this.recognition.continuous = true;

        this.recognition.onresult = (event) => {
            let interim_transcript = '';
            let final_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            
            // Enviem el text final acumulat per a l'anàlisi de la IA
            if (final_transcript) {
                this.transcriptBuffer += final_transcript;
                onFinalResult(final_transcript);
            }
            // I enviem el text provisional per a una visualització ràpida
            if (onResult) {
                onResult(interim_transcript);
            }
        };

        this.recognition.onend = () => {
            if (this.isListening) this.recognition.start();
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
    // ... la resta de funcions (stopListening, getAndClearBuffer) es mantenen igual ...
    stopListening() { /*...*/ },
    getAndClearBuffer() { /*...*/ }
};
