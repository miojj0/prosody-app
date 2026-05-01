const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-fceac.up.railway.app';

export async function generateLyrics(data: {
  fragmento: string;
  tema: string;
  idioma: string;
  quantidade: number;
}) {
  const messages = [];

  for (let i = 1; i <= data.quantidade; i++) {
    messages.push({
      role: 'user',
      content: `Recrie esta letra MANTENDO a prosódia (Versão ${i}/${data.quantidade}):\n\nORIGINAL:\n${data.fragmento}\n\nTEMA: ${data.tema}\nIDIOMÁ: ${data.idioma}\n\nCrie UMA NOVA letra 100% diferente. Retorne APENAS a letra:`
    });
  }

  const response = await fetch(`${API_BASE}/api/generate-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      max_tokens: 1000,
      messages: messages[0] // Será modificado para fazer loop
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getUsage() {
  const response = await fetch(`${API_BASE}/api/usage`);
  if (!response.ok) throw new Error('Failed to fetch usage');
  return response.json();
}

export async function saveGeneration(data: {
  original_lyric: string;
  theme: string;
  language: string;
  variants: string[];
}) {
  const response = await fetch(`${API_BASE}/api/save-generation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error('Failed to save generation');
  return response.json();
}
