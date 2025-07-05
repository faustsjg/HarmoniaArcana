import { MODELS } from './config.js';

async function makeApiRequest(apiKey, model, prompt) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 100 } })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const AI = {
  async analisarContext(apiKey, text) {
    const prompt = `Retorna JSON amb "mood" (combat, exploració, misteri, tensió, social, calma). Text: "${text}"`;
    try {
      const result = await makeApiRequest(apiKey, MODELS.analyst, prompt);
      const jsonMatch = result[0]?.generated_text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};
