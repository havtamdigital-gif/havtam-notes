import { useState, useMemo } from 'react';
import type { DictItem, Category } from '../../types';
import { dict } from '../../data/dictionary';
import DictCard from './DictCard';
import { useProgress } from '../../hooks/useProgress';

const CATS: Array<Category | 'הכל'> = ['הכל','Web Basics','HTML','CSS','JavaScript'];
const CAT_COLORS: Record<string, string> = {
  'הכל':'#FF4FA3', 'Web Basics':'#FF4FA3', HTML:'#E34F26', CSS:'#1572B6', JavaScript:'#8a7500',
};
const CAT_BG: Record<string, string> = {
  'הכל':'#FFE0F0', 'Web Basics':'#FFE0F0', HTML:'#fde8e2', CSS:'#dbeafe', JavaScript:'#fefce8',
};

interface Props {
  onTryPlayground: (item: DictItem) => void;
}

export default function DictView({ onTryPlayground }: Props) {
  const [filter, setFilter] = useState<Category | 'הכל'>('הכל');
  const [query, setQuery] = useState('');
  const { addSearch } = useProgress();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dict.filter(item => {
      const matchCat = filter === 'הכל' || item.cat === filter;
      const matchQ = !q || item.term.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        (item.aliases || []).some(a => a.toLowerCase().includes(q)) ||
        item.exercise.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [filter, query]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 2) addSearch(q.trim());
  };

  return (
    <div style={{ direction:'rtl' }}>
      {/* Search */}
      <div className="mb-4 sticky top-0 z-30 pt-3 pb-2" style={{ background:'#FFF5FA' }}>
        <div className="flex gap-2 max-w-2xl mx-auto mb-3">
          <input
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="🔍 חפשי מושג, שאלה או שם תגית... (למשל: flexbox, מה זה div, hover)"
            className="flex-1 px-4 py-2.5 rounded-full border-2 text-sm outline-none transition-all"
            style={{
              borderColor: query ? '#FF4FA3' : '#F3B6D3',
              background: '#fdf8fb',
              direction:'rtl',
            }}
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap justify-center">
          {CATS.map(cat => (
            <button key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
              style={{
                background: filter === cat ? CAT_COLORS[cat] : CAT_BG[cat],
                color: filter === cat ? (cat === 'JavaScript' ? '#333' : 'white') : CAT_COLORS[cat],
                opacity: filter === cat ? 1 : 0.75,
                boxShadow: filter === cat ? '0 2px 8px rgba(0,0,0,0.15)' : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          {results.length} מושגים
        </div>
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">😕</div>
          <p>לא נמצאו תוצאות — נסי מילה אחרת</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
        }}>
          {results.map(item => (
            <DictCard key={item.id} item={item} onTryPlayground={onTryPlayground} />
          ))}
        </div>
      )}
    </div>
  );
}
