import { Router } from 'express';
import { SYSTEM_PROMPT } from '../data/courseKnowledge.js';

const router = Router();

// Helper to call Anthropic API
async function callAnthropic(messages, system, maxTokens = 1024) {
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
      max_tokens: maxTokens,
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

// POST /api/ai/generate-code — AI Code Writer
router.post('/generate-code', async (req, res) => {
  try {
    const { exercise = '', html = '', css = '' } = req.body;

    if (!exercise || typeof exercise !== 'string') {
      return res.status(400).json({ error: 'exercise is required' });
    }
    if (exercise.length > 12000) {
      return res.status(400).json({ error: 'exercise too long (max 12000 chars)' });
    }
    if (html.length > 12000 || css.length > 12000) {
      return res.status(400).json({ error: 'html/css too long (max 12000 chars each)' });
    }

    const systemPrompt = `אתה מדריכה של פיתוח ווב למתחילות.
המשימה שלך: לקבל תרגיל קידוד בעברית ולהחזיר קוד עובד מלא.

חוקים:
1. ענה רק בJSON תקין — ללא markdown, ללא הסברים מחוץ ל-JSON.
2. השתמשי בHTML/CSS/JS ונילה — ללא frameworks.
3. השתמשי ב-addEventListener בלבד — לא onclick inline.
4. אם ב-HTML חסרים id-ים שדרושים לJS, הוסיפי אותם.
5. הקוד צריך להיות ידידותי למתחילות — בהיר, קריא, עם הערות בעברית.
6. הסבר קצר ובעברית.

פורמט תשובה — JSON בלבד:
{
  "explanation": "הסבר קצר בעברית מה הקוד עושה",
  "html": "קוד HTML מלא ומעודכן",
  "css": "קוד CSS (ריק אם לא צריך)",
  "js": "קוד JavaScript מלא"
}`;

    const userContent = [
      `תרגיל:\n${exercise}`,
      html ? `\nHTML קיים:\n\`\`\`html\n${html}\n\`\`\`` : '',
      css  ? `\nCSS קיים:\n\`\`\`css\n${css}\n\`\`\`` : '',
    ].filter(Boolean).join('\n');

    const raw = await callAnthropic(
      [{ role: 'user', content: userContent }],
      systemPrompt,
      4096
    );

    // Robustly parse JSON — strip any accidental markdown fences
    let parsed;
    try {
      const cleaned = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[generate-code] JSON parse failed. Raw:', raw.slice(0, 300));
      return res.status(500).json({ error: 'Claude returned invalid JSON — try again' });
    }

    const result = {
      explanation: String(parsed.explanation || ''),
      html:        String(parsed.html        || ''),
      css:         String(parsed.css         || ''),
      js:          String(parsed.js          || ''),
    };

    res.json(result);
  } catch (err) {
    console.error('[generate-code error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
