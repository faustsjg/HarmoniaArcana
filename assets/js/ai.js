// FILE: assets/js/ai.js
import { HUGGING_FACE_API_KEY, MODELS } from './config.js';

// Funció genèrica per fer peticions a l'API d'inferència de Hugging Face.
async function makeApiRequest(model, data) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed for model ${model}: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response;
}

export const AI = {
    // Analitza el text de la narració per extreure el context.
    async analisarContext(text) {
        const prompt = `Ets un assistent per a partides de rol. Analitza el següent text i retorna un objecte JSON i res més, sense text addicional. El JSON ha de tenir les claus: "mood" (una paraula clau com 'combat', 'exploració', 'misteri', 'tensió', 'social', 'èpic'), "location" (una descripció curta de la localització), i "keywords" (una llista de fins a 3 paraules clau importants). Text: "${text}"`;
        try {
            const response = await makeApiRequest(MODELS.analyst, { inputs: prompt, parameters: { max_new_tokens: 150 }});
            const result = await response.json();
            
            // Extreu el bloc JSON de la resposta de l'LLM. Aquesta expressió regular pot necessitar ajustos.
            const jsonMatch = result[0].generated_text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("No s'ha trobat un JSON vàlid a la resposta de l'analista:", result[0].generated_text);
                return null;
            }
            const jsonParsed = JSON.parse(jsonMatch[0]);
            console.log("AI: Context analitzat:", jsonParsed);
            return jsonParsed;
        } catch (error) {
            console.error("Error analitzant el context:", error);
            return null;
        }
    },

    // Genera una peça de música a partir d'un prompt.
    async generarMusica(prompt) {
        try {
            console.log(`AI: Generant música amb prompt: "${prompt}"`);
            // NOTA: L'API de MusicGen no retorna "stems" directament d'aquesta manera.
            // Això és una SIMPLIFICACIÓ per a l'exemple. En un cas real, es necessitaria un model que ho permeti
            // o fer una única generació i després intentar separar-la amb un altre model com Demucs.
            // Aquí, generem una sola pista i la retornem com a 3 capes idèntiques per simular la funcionalitat.
            
            const response = await makeApiRequest(MODELS.musicgen, { inputs: prompt });
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            console.log("AI: Pista de música generada.", audioUrl);
            // Simulem una resposta amb 3 stems (capes) per a l'AudioManager.
            return {
                base: audioUrl,
                harmonia: audioUrl,
                melodia: audioUrl,
            };
        } catch (error) {
            console.error("Error generant música:", error);
            return null;
        }
    }
};
