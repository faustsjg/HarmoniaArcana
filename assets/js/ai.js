// FILE: assets/js/ai.js
import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) alert("Error d'autenticació: La clau de l'API no és vàlida.");
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response;
}
export const AI = {
    async analisarContext(apiKey, text) {
        const prompt = `Analitza el text i retorna un objecte JSON amb una única clau "mood". El mood ha de ser una paraula clau com 'combat', 'exploració', 'misteri', 'tensió', 'social', 'calma'. Text: "${text}"`;
        try {
            const response = await makeApiRequest(apiKey, MODELS.analyst, { inputs: prompt, parameters: { max_new_tokens: 100 }});
            const result = await response.json();
            const jsonMatch = result[0].generated_text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) { throw new Error("La resposta de l'analista no conté un JSON vàlid."); }
            const jsonParsed = JSON.parse(jsonMatch[0]);
            console.log(`Mood detectat: ${jsonParsed.mood}`);
            return jsonParsed;
        } catch (error) {
            console.error("Error en l'anàlisi de text:", error);
            return null;
        }
    }
};
