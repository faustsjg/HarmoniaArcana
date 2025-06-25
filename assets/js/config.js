// FILE: assets/js/config.js
export const APP_VERSION = "v8.1.0-UIRestoration";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    // CANVI DEFINITIU: Utilitzem Riffusion. És un model públic, fiable i no hauria de donar problemes d'accés.
    musicgen: "riffusion/riffusion-model-v1"
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 20000,
    minCharsForAnalysis: 30
};
