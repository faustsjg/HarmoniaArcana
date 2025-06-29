export const APP_VERSION = "v10.0.0-IntelligentDJ";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
export const MODELS = {
    // Només necessitem l'analista de text per determinar el 'mood'
    analyst: "meta-llama/Llama-3.1-8B-Instruct"
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 15000,
    minCharsForAnalysis: 25
};
