export const APP_VERSION = "v12.2.0-FullUIRestore";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';
// Deixem l'analista de text, que és l'única IA que farem servir en aquesta arquitectura
export const MODELS = {
    analyst: "meta-llama/Llama-3.1-8B-Instruct"
};
export const DIRECTOR_CONFIG = {
    analysisInterval: 15000,
    minCharsForAnalysis: 25
};