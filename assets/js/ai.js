// FILE: assets/js/ai.js
import { MODELS } from './config.js';

// La clau API ara es passa com a argument per a més seguretat i flexibilitat.
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
        // Si l'error és 401, probablement la clau és invàlida.
        if (response.status === 401) {
             alert("Error d'autenticació: La clau de l'API no és vàlida. Si us plau, revisa-la.");
        }
        throw new Error(`API request failed for model ${model}: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response;
}

export const AI = {
    // Analitza el text de la narració per extreure el context.
    async analisarContext(apiKey, text) {
        const prompt = `Ets un assistent per a partides de rol. Analitza el següent text i retorna un objecte JSON i res més, sense text addicional. El JSON ha de tenir les claus: "mood" (una paraula clau com 'combat', 'exploració', 'misteri', 'tensió', 'social', 'èpic'), "location" (una descripció curta de la localització), i "keywords" (una llista de fins a 3 paraules clau importants). Text: "${text}"`;
        try {
            const response = await makeApiRequest(apiKey, MODELS.analyst, { inputs: prompt, parameters: { max_new_tokens: 150 }});
            const result = await response.json();
            const jsonMatch = result[0].generated_text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("No s'ha trobat un JSON vàlid a la resposta de l'analista:", result[0].generated_text);
                return null;
            }
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error("Error analitzant el context:", error);
            return null;
        }
    },

    // Genera una peça de música a partir d'un prompt.
    async generarMusica(apiKey, prompt) {
        try {
            const response = await makeApiRequest(apiKey, MODELS.musicgen, { inputs: prompt });
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            // Simulem una resposta amb 3 stems (capes) per a l'AudioManager.
            return { base: audioUrl, harmonia: audioUrl, melodia: audioUrl };
        } catch (error) {
            console.error("Error generant música:", error);
            return null;
        }
    }
};
