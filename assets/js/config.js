// FILE: assets/js/config.js

// Versió actual de l'aplicació
export const APP_VERSION = "v3.1-UserAPI";

// Clau que farem servir per guardar i recuperar l'API Key del localStorage.
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';

// Definim els models que farem servir per a cada tasca.
export const MODELS = {
    // Model per analitzar el context de la narració
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    // Model per generar la música.
    musicgen: "facebook/musicgen-small" 
};

// Configuració del Director de IA
export const DIRECTOR_CONFIG = {
    // Cada quants mil·lisegons el director analitza el context.
    analysisInterval: 30000, // 30 segons
    // Nombre mínim de caràcters al buffer per a fer una anàlisi.
    minCharsForAnalysis: 50
};
