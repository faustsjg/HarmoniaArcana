// FILE: assets/js/config.js
export const APP_VERSION = "v9.0.0-AuthFix";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    // Tornem a musicgen-melody, que és el model correcte. Ara l'error d'autenticació és el que hem de solucionar.
    musicgen: "facebook/musicgen-melody" 
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 20000,
    minCharsForAnalysis: 30
};
