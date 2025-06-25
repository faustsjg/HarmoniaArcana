// FILE: assets/js/config.js
export const APP_VERSION = "v6.1.0-Resilience";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    // CANVI: Provem un altre model de la família MusicGen.
    musicgen: "facebook/musicgen-chorus" 
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 20000,
    minCharsForAnalysis: 30
};
