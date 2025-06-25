// FILE: assets/js/config.js
export const APP_VERSION = "v6.0.1-MusicEngineFix";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    // CANVI: Utilitzem un model alternatiu i molt fiable de la mateixa família.
    musicgen: "facebook/musicgen-melody" 
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 20000,
    minCharsForAnalysis: 30
};