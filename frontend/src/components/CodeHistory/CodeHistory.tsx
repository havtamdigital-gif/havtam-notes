import { useProgress } from '../../hooks/useProgress';
import type { CodeAttempt } from '../../types';

interface Props {
  onReopen: (attempt: CodeAttempt) => void;
}

export default function CodeHistory({ onReopen }: Props) {
  const { progress } = useProgress();
  const attempts = progress.codeAttempts;

  const deleteAttempt = (id: string) => {
    // We can't delete directly from hook — update to mark deleted
    // Simple approach: re-save all except this one
    const updated = attempts.filter(a => a.id !== id);
    // Manually update localStorage
    const stored = JSON.parse(localStorage.getItem('havtam_progress_v2') || '{}');
    stored.codeAttempts = updated;
    localStorage.setItem('havtam_progress_v2', JSON.stringify(stored));
    window.location.reload();
  };

  const toggleFavorite = (id: string) => {
    const stored = JSON.parse(localStorage.getItem('havtam_progress_v2') || '{}');
    stored.codeAttempts = (stored.codeAttempts||[]).map((a: CodeAttempt) =>
      a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
    );
    localStorage.setItem('havtam_progress_v2', JSON.stringify(stored));
    window.location.reload();
  };

  if (!attempts.length) return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-5xl mb-4">📂</div>
      <p>עדיין אין קודים שמורים. הריצי קוד ב-Playground כדי לשמור!</p>
    </div>
  );

  const statusConfig = {
    success:     { label:'✅ הצלחה',    bg:'#e8f5e9', color:'#1b5e20' },
    error:       { label:'⚠️ שגיאה',     bg:'#ffebee', color:'#b71c1c' },
    needs_review:{ label:'💾 שמור',     bg:'#fff8e1', color:'#5d4037' },
  };

  return (
    <div style={{ direction:'rtl' }}>
      <h2 className="text-xl font-bold mb-4" style={{ color:'#FF4FA3' }}>📂 הקודים שלי</h2>
      <p className="text-sm text-gray-500 mb-4">{attempts.length} ניסיונות</p>

      <div className="space-y-3">
        {attempts.map(a => {
          const sc = statusConfig[a.status] || statusConfig.needs_review;
          const date = new Date(a.createdAt).toLocaleDateString('he-IL', {
            day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'
          });
          const preview = (a.html || a.css || a.js).slice(0, 80);
          return (
            <div key={a.id} className="rounded-2xl p-4"
              style={{ background:'white', boxShadow:'0 2px 8px rgba(233,30,140,0.08)', border: a.isFavorite ? '2px solid #FF4FA3' : '2px solid transparent' }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background:sc.bg, color:sc.color }}>
                    {sc.label}
                  </span>
                  <span className="text-xs text-gray-400">{date}</span>
                  {a.relatedTopics.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background:'#FFE0F0', color:'#D63384' }}>
                      {a.relatedTopics[0]}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleFavorite(a.id)}
                    title="מועדפים"
                    className="text-lg">{a.isFavorite ? '❤️' : '🤍'}</button>
                  <button onClick={() => deleteAttempt(a.id)}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background:'#ffebee', color:'#b71c1c' }}>
                    מחקי
                  </button>
                </div>
              </div>

              {preview && (
                <pre className="text-xs rounded-lg p-2 mb-3 overflow-hidden"
                  style={{ background:'#1e1e2e', color:'#cdd6f4', direction:'ltr', textAlign:'left', maxHeight:'60px' }}>
                  {preview}...
                </pre>
              )}

              {a.aiFeedback && (
                <div className="text-xs rounded-lg p-2 mb-2"
                  style={{ background:'#FFF0F7', color:'#D63384' }}>
                  🤖 {a.aiFeedback.slice(0,100)}...
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => onReopen(a)}
                  className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#FF4FA3,#9c27b0)' }}>
                  📂 פתחי שוב ב-Playground
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
