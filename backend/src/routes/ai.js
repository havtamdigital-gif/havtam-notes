import { Router } from 'express';
import { SYSTEM_PROMPT } from '../data/courseKnowledge.js';

const router = Router();

// Helper to call Anthropic API
async function callAnthropic(messages, system) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in .env');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.content[0]?.text || '';
}

// POST /api/ai/chat — AI tutor chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const messages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const reply = await callAnthropic(messages, SYSTEM_PROMPT);
    res.json({ reply });
  } catch (err) {
    console.error('[AI chat error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/review — code review
router.post('/review', async (req, res) => {
  try {
    const { html = '', css = '', js = '' } = req.body;

    const codeBlock = [
      html ? `HTML:\n\`\`\`html\n${html}\n\`\`\`` : '',
      css  ? `CSS:\n\`\`\`css\n${css}\n\`\`\`` : '',
      js   ? `JavaScript:\n\`\`\`js\n${js}\n\`\`\`` : '',
    ].filter(Boolean).join('\n\n');

    const prompt = `סקרי את הקוד הבא ותני פידבק קצר בעברית:
${codeBlock}

תני:
1. האם הקוד תקין? (כן/לא/כמעט)
2. מה עובד טוב
3. מה כדאי לשפר (אם יש)
4. טיפ אחד קצר לשיפור
ענה בקצרה ובעברית.`;

    const feedback = await callAnthropic([{ role:'user', content:prompt }], SYSTEM_PROMPT);
    res.json({ feedback });
  } catch (err) {
    console.error('[AI review error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/explain — explain code
router.post('/explain', async (req, res) => {
  try {
    const { code, language = 'auto' } = req.body;
    const prompt = `הסבירי את הקוד הבא שורה שורה בעברית פשוטה למתחילה:\n\`\`\`${language}\n${code}\n\`\`\`\nהסברי כל שורה או בלוק.`;
    const explanation = await callAnthropic([{ role:'user', content:prompt }], SYSTEM_PROMPT);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
