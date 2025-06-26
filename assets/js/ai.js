// FILE: assets/js/ai.js
import { UI } from './ui.js';
import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    UI.logToActionPanel(`API: Fent petició a ${model} amb la clau ${apiKey.substring(0, 5)}...****`, 'ai');
    const response = await fetch(apiUrl, {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorBody = await response.text();
        UI.logToActionPanel(`API ERROR: ${response.status} - ${response.statusText}. Resposta: ${errorBody}`, 'error');
        throw new Error(`API request failed: ${response.status}`);
    }
    return response;
}
export const AI = {
    async analisarContext(apiKey, text) {
        UI.logToActionPanel(`AI: Analitzant text: "${text.substring(0, 40)}..."`, 'ai');
        const prompt = `Ets un assistent per a partides de rol. Analitza el següent text i retorna un objecte JSON i res més, sense text addicional. El JSON ha de tenir les claus: "mood", "location", i "keywords". Mood ha de ser una paraula clau com 'combat', 'exploració', 'misteri', 'tensió', 'social', 'èpic'. Text: "${text}"`;
        try {
            const response = await makeApiRequest(apiKey, MODELS.analyst, { inputs: prompt, parameters: { max_new_tokens: 150 }});
            const result = await response.json();
            const jsonMatch = result[0].generated_text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { throw new Error("La resposta de l'analista no conté un JSON vàlid."); }
            const jsonParsed = JSON.parse(jsonMatch[0]);
            UI.logToActionPanel(`AI: Context rebut: {mood: "${jsonParsed.mood}"}`, 'success');
            return jsonParsed;
        } catch (error) { UI.logToActionPanel(`AI ERROR (Anàlisi): ${error.message}`, 'error'); return null; }
    },
    async generarMusica(apiKey, prompt, layerName = 'pista') {
        UI.logToActionPanel(`AI: Enviant prompt per a la capa '${layerName}'...`, 'ai');
        try {
            const response = await makeApiRequest(apiKey, MODELS.musicgen, { inputs: prompt });
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            UI.logToActionPanel(`AI: Pista per a '${layerName}' generada amb èxit.`, 'success');
            return { [layerName]: audioUrl };
        } catch (error) { UI.logToActionPanel(`AI ERROR (Capa ${layerName}): ${error.message}`, 'error'); return null; }
    }
};