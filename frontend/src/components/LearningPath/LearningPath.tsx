import { useState } from 'react';
import { lessons } from '../../data/lessons';
import { useProgress } from '../../hooks/useProgress';

export default function LearningPath() {
  const { progress, completeLesson, estimateLevel, getWeakTopics } = useProgress();
  const [openLesson, setOpenLesson] = useState<number|null>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});

  const done = progress.completedLessons.length;
  const total = lessons.length;
  const pct = total ? Math.round((done/total)*100) : 0;
  const level = estimateLevel();
  const weak = getWeakTopics();

  const badges = [
    { label:'🌱 התחלה!', req:1 },
    { label:'🟠 HTML מומחית', req:3 },
    { label:'🔵 CSS מומחית', req:6 },
    { label:'⭐ חצי הדרך!', req:Math.ceil(total/2) },
    { label:'🏆 סיימתי הכל!', req:total },
  ];

  const checkAnswer = (lessonId: number, qIdx: number, chosen: number, correct: number) => {
    const key = `${lessonId}-${qIdx}`;
    setAnswers(a => ({ ...a, [key]: chosen === correct ? 'correct' : 'wrong' }));
    if (chosen === correct) {
      const allQ = lessons.find(l => l.id === lessonId)?.quiz || [];
      const allDone = allQ.every((_,i) => (answers[`${lessonId}-${i}`] === 'correct') || i === qIdx);
      if (allDone) completeLesson(lessonId);
    }
  };

  return (
    <div style={{ direction:'rtl' }}>
      {/* Level card */}
      <div className="rounded-2xl p-5 mb-5" style={{ background:'white', boxShadow:'0 2px 12px rgba(233,30,140,0.10)' }}>
        <h2 className="text-lg font-bold mb-1" style={{ color:'#FF4FA3' }}>🎯 מסלול הלמידה שלי</h2>
        <p className="text-sm text-gray-500 mb-3">השלמת <b>{done}</b> מתוך <b>{total}</b> שיעורים</p>
        <div className="rounded-full h-3 mb-4 overflow-hidden" style={{ background:'#FFE0F0' }}>
          <div className="h-full rounded-full transition-all" style={{
            width:`${pct}%`, background:'linear-gradient(90deg,#FF4FA3,#9c27b0)'
          }} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="rounded-xl p-3 text-center" style={{ background:'#FFF0F7' }}>
            <div className="font-bold" style={{ color:'#FF4FA3' }}>הרמה שלך</div>
            <div className="text-lg font-bold">{level}</div>
          </div>
          {weak.length > 0 && (
            <div className="rounded-xl p-3 text-center" style={{ background:'#fff8e1' }}>
              <div className="font-bold text-yellow-700">כדאי לחזק</div>
              <div className="text-xs">{weak.join(', ')}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map(b => (
            <span key={b.label}
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{
                background: done >= b.req ? 'linear-gradient(135deg,#FF4FA3,#9c27b0)' : '#FFE0F0',
                color: done >= b.req ? 'white' : '#D63384',
              }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map(l => {
          const isDone = progress.completedLessons.includes(l.id);
          const isOpen = openLesson === l.id;
          return (
            <div key={l.id} className="rounded-2xl overflow-hidden" style={{ background:'white', boxShadow:'0 2px 12px rgba(233,30,140,0.08)', borderRight:`4px solid ${isDone ? '#FF4FA3' : '#F3B6D3'}` }}>
              <button
                className="w-full flex items-center gap-3 p-4 text-right"
                onClick={() => setOpenLesson(isOpen ? null : l.id)}
              >
                <span className="text-2xl">{l.icon}</span>
                <div className="flex-1 text-right">
                  <div className="font-bold text-sm">{l.title}</div>
                  <div className="text-xs text-gray-500">{l.sub}</div>
                </div>
                <div className="mr-auto">{isDone ? '✅' : (isOpen ? '▲' : '▼')}</div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t" style={{ borderColor:'#F3B6D3' }}>
                  <div className="text-sm text-gray-700 mt-3 mb-4" dangerouslySetInnerHTML={{ __html: l.content }} />

                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">📝 שאלון</div>
                  {l.quiz.map((q, qi) => {
                    const key = `${l.id}-${qi}`;
                    const answered = answers[key];
                    return (
                      <div key={qi} className="rounded-xl p-3 mb-3" style={{ background:'#FFF0F7' }}>
                        <p className="font-semibold text-sm mb-2">{q.q}</p>
                        <div className="space-y-1">
                          {q.opts.map((opt, oi) => {
                            let bg = 'white', border = '#F3B6D3', color = '#2B2230';
                            if (answered) {
                              if (oi === q.ans) { bg='#e8f5e9'; border='#4caf50'; color='#1b5e20'; }
                              else if (oi === Number(answered === 'wrong' && answers[key]) ) { bg='#ffebee'; border='#f44336'; }
                            }
                            return (
                              <button key={oi}
                                disabled={!!answered}
                                onClick={() => checkAnswer(l.id, qi, oi, q.ans)}
                                className="w-full text-right px-3 py-2 rounded-lg text-sm border-2 transition-all"
                                style={{ background:bg, borderColor:border, color }}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {answered && q.explanation && (
                          <div className="mt-2 text-xs rounded-lg p-2"
                            style={{ background:'#e8f5e9', color:'#1b5e20' }}>
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
