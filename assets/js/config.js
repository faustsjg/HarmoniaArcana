// FILE: assets/js/config.js
export const APP_VERSION = "v5.3.0-AILoopDebug";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    musicgen: "facebook/musicgen-small" 
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 20000, // Reduïm a 20 segons per a proves més ràpides
    minCharsForAnalysis: 30
};
