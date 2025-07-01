import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, data) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method:'POST',
    headers:{Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.text();
    if (res.status===401) alert("Clau API no vàlida");
    throw new Error(`Error: ${res.status} - ${err}`);
  }
  return res;
}

export const AI = {
  async analitzar(apiKey, text) {
    const prompt = `Analitza i retorna {"mood": "<...>"} segons: "${text}"`;
    try {
      const r = await makeApiRequest(apiKey, MODELS.analyst, {inputs:prompt, parameters:{max_new_tokens:50}});
      const json = await r.json();
      const m = json[0].generated_text.match(/\{.+\}/);
      if (!m) throw new Error("Resposta no JSON");
      return JSON.parse(m[0]);
    } catch(e) {
      console.error(e);
      return null;
    }
  }
};
