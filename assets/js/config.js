// FILE: assets/js/config.js

// Versió actual de l'aplicació
export const APP_VERSION = "v3.7.1-UIScreenFix";

// Clau que farem servir per guardar i recuperar l'API Key del localStorage.
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';

// Definim els models que farem servir per a cada tasca.
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct",
    musicgen: "facebook/musicgen-small" 
};

// Configuració del Director de IA
export const DIRECTOR_CONFIG = {
    analysisInterval: 30000, // 30 segons
    minCharsForAnalysis: 50
};
