export const APP_VERSION = "v13.3.5";
export const API_KEY_STORAGE_ID = 'harmoniaArcana_huggingFaceApiKey';

export const MODELS = {
  analyst: "meta-llama/Llama-3.1-8B-Instruct"
};

export const DIRECTOR_CONFIG = {
  analysisInterval: 15000,
  minCharsForAnalysis: 25
};

export const INSTALL_STEPS = [
  {
    title: "Pas 1: Registra't a Hugging Face",
    desc: "Crea un compte gratuït a Hugging Face per poder generar tokens.",
    link: "https://huggingface.co/join"
  },
  {
    title: "Pas 2: Accepta Llama‑3.1",
    desc: "Accedeix a la pàgina de Llama‑3.1 i sol·licita accés o accepta condicions.",
    link: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct"
  },
  {
    title: "Pas 3: Crea un token",
    desc: "A la secció de tokens del teu perfil, crea un nou token amb permisos de lectura.",
    link: "https://huggingface.co/settings/tokens"
  },
  {
    title: "Pas 4: Copia i enganxa",
    desc: "Introdueix el token que comença per “hf_...” al camp corresponent.",
    link: null
  }
];
