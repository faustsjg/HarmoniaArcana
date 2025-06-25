// FILE: assets/js/ai.js
import { UI } from './ui.js';
import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
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
        UI.logToActionPanel(`AI: Analitzant text: "${text.substring(0, 50)}..."`, 'ai');
        const prompt = `Ets un assistent per a partides de rol. Analitza el següent text i retorna un objecte JSON i res més, sense text addicional. El JSON ha de tenir les claus: "mood" (una paraula clau com 'combat', 'exploració', 'misteri', 'tensió', 'social', 'èpic'), "location" (una descripció curta de la localització), i "keywords" (una llista de fins a 3 paraules clau importants). Text: "${text}"`;
        try {
            const response = await makeApiRequest(apiKey, MODELS.analyst, { inputs: prompt, parameters: { max_new_tokens: 150 }});
            const result = await response.json();
            const jsonMatch = result[0].generated_text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { UI.logToActionPanel("AI ERROR (Anàlisi): No s'ha trobat un JSON vàlid.", 'error'); return null; }
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
