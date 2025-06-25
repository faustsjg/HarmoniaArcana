// FILE: assets/js/ai.js
import { UI } from './ui.js';
import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    // Línia de depuració per confirmar la clau que s'està utilitzant (de manera segura)
    UI.logToActionPanel(`API: Fent petició a ${model} amb la clau ${apiKey.substring(0, 5)}...****`);

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorBody = await response.text();
        UI.logToActionPanel(`API ERROR: ${response.status} - ${response.statusText}. Resposta del servidor: ${errorBody}`, 'error');
        throw new Error(`API request failed: ${response.status}`);
    }
    return response;
}

export const AI = {
    async analisarContext(apiKey, text) {
        const prompt = `Ets un assistent per a partides de rol... Text: "${text}"`;
        try {
            const response = await makeApiRequest(apiKey, MODELS.analyst, { inputs: prompt, parameters: { max_new_tokens: 150 }});
            const result = await response.json();
            const jsonMatch = result[0].generated_text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { throw new Error("La resposta de l'analista no conté un JSON vàlid."); }
            const jsonParsed = JSON.parse(jsonMatch[0]);
            UI.logToActionPanel(`AI: Context rebut: {mood: "${jsonParsed.mood}"}`, 'success');
            return jsonParsed;
        } catch (error) {
            UI.logToActionPanel(`AI ERROR (Anàlisi): ${error.message}`, 'error');
            return null;
        }
    },

    async generarMusica(apiKey, prompt, layerName = 'pista') {
        UI.logToActionPanel(`AI: Enviant prompt per a la capa '${layerName}'...`, 'ai');
        try {
            const response = await makeApiRequest(apiKey, MODELS.musicgen, { inputs: prompt });
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            UI.logToActionPanel(`AI: Pista per a '${layerName}' generada amb èxit.`, 'success');
            return { [layerName]: audioUrl };
        } catch (error) {
            UI.logToActionPanel(`AI ERROR (Generació de la capa ${layerName}): ${error.message}`, 'error');
            return null;
        }
    }
};
