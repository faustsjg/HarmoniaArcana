// FILE: assets/js/speech.js

// Accedim a l'API de reconeixement de veu, compatible amb Chrome i altres navegadors.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Speech = {
    recognition: null,
    transcriptBuffer: "", // Aquí s'acumula el text transcrit.
    isListening: false,
    
    init(onNewText) {
        if (!SpeechRecognition) {
            console.error("El reconeixement de veu no és compatible amb aquest navegador.");
            alert("El reconeixement de veu no és compatible amb aquest navegador.");
            return false;
        }
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ca-ES'; // Idioma de reconeixement
        this.recognition.interimResults = false; // No volem resultats provisionals
        this.recognition.continuous = true; // Continua escoltant fins que es pari explícitament

        // Aquest esdeveniment salta cada cop que es detecta una frase completa.
        this.recognition.onresult = (event) => {
            let newText = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                newText += event.results[i][0].transcript;
            }
            this.transcriptBuffer += newText + " ";
            onNewText(newText); // Cridem la funció callback per notificar
        };

        // Si l'escolta s'atura per alguna raó (ex: silenci llarg), la reiniciem.
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

    // El Director cridarà aquesta funció per obtenir el text acumulat i netejar el buffer.
    getAndClearBuffer() {
        const buffer = this.transcriptBuffer;
        this.transcriptBuffer = "";
        return buffer;
    }
};
