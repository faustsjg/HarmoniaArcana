// FILE: assets/js/ai.js
import { UI } from './ui.js';
import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) alert("Error d'autenticació: La clau de l'API no és vàlida.");
        throw new Error(`API request failed for model ${model}: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response;
}

export const AI = {
    async analisarContext(apiKey, text) {
        // ... (sense canvis)
    },

    // Ara accepta un 'layerName' per identificar la generació al registre d'accions.
    async generarMusica(apiKey, prompt, layerName = 'pista') {
        UI.logToActionPanel(`AI: Enviant prompt per a la capa '${layerName}'...`, 'ai');
        try {
            const response = await makeApiRequest(apiKey, MODELS.musicgen, { inputs: prompt });
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            UI.logToActionPanel(`AI: Pista per a '${layerName}' generada amb èxit.`, 'success');
            // Retorna un objecte amb el nom de la capa com a clau.
            return { [layerName]: audioUrl };
        } catch (error) {
            UI.logToActionPanel(`AI ERROR (Capa ${layerName}): ${error.message}`, 'error');
            return null;
        }
    }
};
