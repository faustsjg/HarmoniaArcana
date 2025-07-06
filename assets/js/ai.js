import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    alert("Error IA: " + res.status + " " + res.statusText);
    throw new Error(`IA failed: ${res.status}`);
  }
  return res;
}

export const AI = {
  async analisarContext(apiKey, text) {
    const prompt = `Analitza i retorna només {"mood":"valor"} on el valor és combat, calma, misteri, tensio, social, boss, emocional, triomf. Text:"${text}"`;
    try {
      const res = await makeApiRequest(apiKey, MODELS.analyst, {inputs: prompt, parameters: {max_new_tokens:50}});
      const j = await res.json();
      const m = j[0]?.generated_text.match(/\{.*\}/);
      return m ? JSON.parse(m[0]) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};
