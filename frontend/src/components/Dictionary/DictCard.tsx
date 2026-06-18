import { useState, useRef } from 'react';
import type { DictItem } from '../../types';

interface Props {
  item: DictItem;
  onTryPlayground: (item: DictItem) => void;
}

const CAT_COLORS: Record<string, { border: string; badge: string; text: string }> = {
  HTML:        { border: '#E34F26', badge: '#fde8e2', text: '#E34F26' },
  CSS:         { border: '#1572B6', badge: '#dbeafe', text: '#1572B6' },
  JavaScript:  { border: '#F7DF1E', badge: '#fefce8', text: '#8a7500' },
  'Web Basics':{ border: '#FF4FA3', badge: '#FFE0F0', text: '#D63384' },
};

export default function DictCard({ item, onTryPlayground }: Props) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const c = CAT_COLORS[item.cat] || CAT_COLORS['Web Basics'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || open) return; // don't tilt when expanded
    const rect = card.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    card.style.transition = 'none';
    card.style.transform  = `perspective(700px) rotateX(${-dy * 7}deg) rotateY(${dx * 9}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.45s cubic-bezier(.25,.8,.25,1)';
    card.style.transform  = '';
  };

  return (
    <div
      ref={cardRef}
      className="card-3d p-4 cursor-pointer"
      style={{
        background: 'white',
        borderRight: `4px solid ${c.border}`,
        boxShadow: open ? '0 8px 24px rgba(233,30,140,0.15)' : '0 2px 12px rgba(233,30,140,0.08)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-2 mb-2" onClick={() => setOpen(o => !o)}>
        <span className="font-bold text-sm ltr" style={{ fontFamily:'monospace', color:'#1a1a2e', direction:'ltr' }}>
          {item.term}
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: c.badge, color: c.text }}>
          {item.cat}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-2 cursor-pointer"
        onClick={() => setOpen(o => !o)}>
        {item.desc}
      </p>

      <button
        onClick={() => setOpen(o => !o)}
        className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
        style={{ color:'#FF4FA3', background:'#FFE0F0' }}
      >
        {open ? '▲ סגור' : '▼ הסבר מורחב + קוד'}
      </button>

      {/* Expanded content */}
      {open && (
        <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor:'#F3B6D3' }}>
          {item.when && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">⏰ מתי משתמשים?</div>
              <div className="text-sm text-gray-700">{item.when}</div>
            </div>
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">💻 דוגמת קוד</div>
            <pre className="code-block text-xs">{item.code}</pre>
          </div>
          {item.lines && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">🔍 פירוק שורה שורה</div>
              <div className="text-sm text-gray-700">{item.lines}</div>
            </div>
          )}
          {item.mistake && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">⚠️ טעות נפוצה</div>
              <div className="text-sm rounded-lg p-2" style={{ background:'#fff0f0', borderRight:'3px solid #e53935', color:'#b71c1c' }}>
                {item.mistake}
              </div>
            </div>
          )}
          {item.exercise && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">✏️ תרגיל קטן</div>
              <div className="text-sm rounded-lg p-2" style={{ background:'#fff8e1', borderRight:'3px solid #ffc107', color:'#5d4037' }}>
                {item.exercise}
              </div>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onTryPlayground(item); }}
            className="w-full py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
            style={{ background:'linear-gradient(135deg,#FF4FA3,#9c27b0)' }}
          >
            🧪 נסי בPlayground
          </button>
        </div>
      )}
    </div>
  );
}
