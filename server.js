import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Proxy a Google Gemini 1.5 Flash (1500 req/día gratis) ─────────────
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor.' });
  }

  try {
    const { system, messages, max_tokens } = req.body;

    // Traducir formato Anthropic → formato Gemini
    const geminiContents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const geminiBody = {
      system_instruction: system ? { parts: [{ text: system }] } : undefined,
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: max_tokens || 1400,
        temperature: 0.7,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Error de Gemini API' });
    }

    // Traducir respuesta Gemini → formato Anthropic (que el frontend ya entiende)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({
      content: [{ type: 'text', text }],
    });

  } catch (err) {
    console.error('Error al llamar a Gemini:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// ── SPA fallback ──────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✦ Luma corriendo en http://localhost:${PORT}\n`);
  console.log(`   Modelo: Gemini 1.5 Flash (gratis — 1500 req/día)\n`);
});
