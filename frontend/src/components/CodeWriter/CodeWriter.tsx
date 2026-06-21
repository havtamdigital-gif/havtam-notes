import { useState } from 'react';

const API_BASE =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_BASE_URL ||
  'http://localhost:3001';

interface CodeResult {
  explanation: string;
  html: string;
  css: string;
  js: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      onClick={copy}
      style={{
        padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700,
        borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: copied ? '#22c55e' : '#FF4FA3',
        color: 'white', transition: 'background 0.2s',
      }}
    >
      {copied ? '✓ הועתק' : 'העתקי'}
    </button>
  );
}

function CodeBlock({ label, code, lang }: { label: string; code: string; lang: string }) {
  if (!code.trim()) return null;
  const colors: Record<string, { bg: string; badge: string; text: string }> = {
    html:       { bg: '#fde8e2', badge: '#E34F26', text: '#E34F26' },
    css:        { bg: '#dbeafe', badge: '#1572B6', text: '#1572B6' },
    javascript: { bg: '#fefce8', badge: '#8a7500', text: '#8a7500' },
  };
  const c = colors[lang] || colors.javascript;
  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      border: `2px solid ${c.badge}22`,
      boxShadow: '0 4px 16px rgba(214,51,132,0.07)',
      overflow: 'hidden', marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: c.bg,
      }}>
        <span style={{
          fontSize: '0.8rem', fontWeight: 800, color: c.text,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{label}</span>
        <CopyButton text={code} />
      </div>
      <pre style={{
        margin: 0, padding: '16px', overflowX: 'auto',
        fontSize: '0.82rem', lineHeight: 1.6,
        background: '#1a1a2e', color: '#e2e8f0',
        fontFamily: "'Fira Code', 'Courier New', monospace",
        direction: 'ltr', textAlign: 'left',
        maxHeight: '400px',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function CodeWriter() {
  const [exercise, setExercise] = useState('');
  const [existingHtml, setExistingHtml] = useState('');
  const [existingCss, setExistingCss] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CodeResult | null>(null);

  const generate = async () => {
    if (!exercise.trim()) {
      setError('נא להדביקי את השאלה / התרגיל לפני שתלחצי על יצירת הקוד 🌸');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: exercise.trim(),
          html: existingHtml.trim(),
          css: existingCss.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `שגיאת שרת (${res.status})`);
      }
      const data: CodeResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
      if (msg.includes('fetch') || msg.includes('Failed')) {
        setError('לא ניתן להתחבר לשרת ה-AI 😔 ודאי שה-Backend רץ מקומית, או שהאתר מחובר לשרת פרוס.');
      } else {
        setError(`שגיאה: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const textareaStyle = {
    width: '100%', borderRadius: '12px', border: '2px solid #FFD6EA',
    padding: '12px 14px', fontSize: '0.9rem', fontFamily: 'inherit',
    resize: 'vertical' as const, outline: 'none', direction: 'rtl' as const,
    transition: 'border-color 0.2s', background: 'white', color: '#1a1a2e',
    boxSizing: 'border-box' as const,
  };

  return (
    <div dir="rtl" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 0 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 900, margin: '0 0 8px',
          background: 'linear-gradient(135deg, #FF4FA3, #9c27b0)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          ✨ כותבת קוד AI
        </h1>
        <p style={{ color: '#888', fontSize: '0.95rem', margin: 0 }}>
          הדביקי תרגיל בעברית — Claude תכתוב עבורך HTML, CSS ו-JavaScript
        </p>
      </div>

      {/* Input card */}
      <div style={{
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        borderRadius: '20px', padding: '28px', marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(214,51,132,0.10)',
        border: '1px solid rgba(255,79,163,0.15)',
      }}>
        {/* Exercise */}
        <label style={{ display: 'block', fontWeight: 700, color: '#D63384', marginBottom: '6px', fontSize: '0.9rem' }}>
          📝 השאלה / התרגיל <span style={{ color: '#FF4FA3' }}>*</span>
        </label>
        <textarea
          value={exercise}
          onChange={e => setExercise(e.target.value)}
          placeholder="לדוגמה: עלייך ליצור משחק מתמטי בעזרת HTML + JS..."
          rows={5}
          style={{ ...textareaStyle, marginBottom: '20px' }}
        />

        {/* Existing HTML */}
        <label style={{ display: 'block', fontWeight: 700, color: '#1572B6', marginBottom: '6px', fontSize: '0.9rem' }}>
          🔧 HTML קיים — אופציונלי
        </label>
        <textarea
          value={existingHtml}
          onChange={e => setExistingHtml(e.target.value)}
          placeholder="הדביקי כאן את קוד ה-HTML הקיים אם יש..."
          rows={4}
          style={{ ...textareaStyle, marginBottom: '20px', direction: 'ltr', textAlign: 'left' }}
        />

        {/* Existing CSS */}
        <label style={{ display: 'block', fontWeight: 700, color: '#1572B6', marginBottom: '6px', fontSize: '0.9rem' }}>
          🎨 CSS קיים — אופציונלי
        </label>
        <textarea
          value={existingCss}
          onChange={e => setExistingCss(e.target.value)}
          placeholder="הדביקי כאן את קוד ה-CSS הקיים אם יש..."
          rows={3}
          style={{ ...textareaStyle, marginBottom: '24px', direction: 'ltr', textAlign: 'left' }}
        />

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800,
            borderRadius: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? 'linear-gradient(135deg, #ccc, #aaa)'
              : 'linear-gradient(135deg, #FF4FA3, #9c27b0)',
            color: 'white',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(255,79,163,0.35)',
            transition: 'all 0.2s',
            letterSpacing: '0.03em',
          }}
        >
          {loading ? '⏳ יוצרת קוד...' : '✨ צרי קוד'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fff0f0', border: '2px solid #fca5a5', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '20px', color: '#b91c1c',
          fontSize: '0.92rem', fontWeight: 600,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          textAlign: 'center', padding: '40px',
          background: 'rgba(255,255,255,0.8)', borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(214,51,132,0.08)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px', animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>✨</div>
          <p style={{ color: '#D63384', fontWeight: 700, margin: 0 }}>Claude כותבת קוד עבורך...</p>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '4px' }}>זה לוקח כמה שניות</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div>
          {/* Explanation */}
          {result.explanation && (
            <div style={{
              background: 'linear-gradient(135deg, #fff5fa, #ffe0ee)',
              borderRadius: '16px', padding: '20px 24px', marginBottom: '20px',
              border: '2px solid rgba(255,79,163,0.2)',
              boxShadow: '0 4px 16px rgba(214,51,132,0.08)',
            }}>
              <div style={{ fontWeight: 800, color: '#D63384', marginBottom: '8px', fontSize: '0.9rem' }}>
                💡 הסבר
              </div>
              <p style={{ margin: 0, color: '#1a1a2e', lineHeight: 1.7, fontSize: '0.93rem' }}>
                {result.explanation}
              </p>
            </div>
          )}

          {/* Code blocks */}
          <CodeBlock label="HTML" code={result.html} lang="html" />
          <CodeBlock label="CSS" code={result.css} lang="css" />
          <CodeBlock label="JavaScript" code={result.js} lang="javascript" />

          {/* Done */}
          <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.82rem', marginTop: '8px' }}>
            🌸 הקוד מוכן — העתיקי כל בלוק ובדקי ב-Playground
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          color: '#ccc', fontSize: '0.9rem',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💻</div>
          <p style={{ margin: 0 }}>הדביקי תרגיל למעלה ולחצי על <strong style={{ color: '#FF4FA3' }}>צרי קוד</strong></p>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea:focus { border-color: #FF4FA3 !important; }
      `}</style>
    </div>
  );
}
