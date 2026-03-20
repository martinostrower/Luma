import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Proxy a Groq (gratis — 14.400 req/día, funciona en Argentina) ──────
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY no configurada en el servidor.' });
  }

  try {
    const { system, messages, max_tokens } = req.body;

    // Groq usa el mismo formato que OpenAI — muy simple
    const groqMessages = [];
    if (system) groqMessages.push({ role: 'system', content: system });
    groqMessages.push(...messages);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: max_tokens || 1400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Error de Groq API' });
    }

    // Traducir respuesta Groq → formato Anthropic (que el frontend ya entiende)
    const text = data.choices?.[0]?.message?.content || '';
    res.json({
      content: [{ type: 'text', text }],
    });

  } catch (err) {
    console.error('Error al llamar a Groq:', err);
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
  console.log(`   Modelo: Llama 3.3 70B via Groq (gratis — 14.400 req/día)\n`);
});
