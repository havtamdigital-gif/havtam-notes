import { useLocalStorage } from './useLocalStorage';
import type { UserProgress } from '../types';

const INITIAL: UserProgress = {
  completedLessons: [],
  codeAttempts: [],
  searchHistory: [],
  currentLevel: 'beginner',
  weakTopics: [],
  badges: [],
  quizResults: {},
};

export interface BadgeInfo { id: string; label: string; icon: string; desc: string }

export const ALL_BADGES: BadgeInfo[] = [
  { id:'first_lesson',  icon:'🎓', label:'שיעור ראשון!',    desc:'השלמת את השיעור הראשון' },
  { id:'five_lessons',  icon:'🌟', label:'5 שיעורים',        desc:'השלמת 5 שיעורים' },
  { id:'all_lessons',   icon:'🏆', label:'את אלופה!',        desc:'השלמת את כל 10 השיעורים' },
  { id:'first_code',    icon:'💻', label:'מתכנתת!',          desc:'ניסיון קוד ראשון ב-Playground' },
  { id:'ten_code',      icon:'🔥', label:'10 קודים',         desc:'10 ניסיונות ב-Playground' },
  { id:'first_search',  icon:'🔍', label:'סקרנית!',          desc:'חיפוש ראשון במילון' },
  { id:'dict_explorer', icon:'📖', label:'חוקרת המילון',     desc:'50+ חיפושים במילון' },
  { id:'streak_3',      icon:'⚡', label:'3 ימים רצוף',      desc:'פעילות 3 ימים ברצף' },
  { id:'streak_7',      icon:'🌸', label:'שבוע שלם!',        desc:'פעילות 7 ימים ברצף' },
];

function todayStr() { return new Date().toISOString().slice(0,10); }

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress & {
    lastActiveDate?: string; streak?: number; quizScore?: number;
  }>('havtam_progress_v2', INITIAL);

  // ── award badge helper ────────────────────────────────────────
  const awardBadge = (id: string) => {
    setProgress(p => ({
      ...p,
      badges: p.badges.includes(id) ? p.badges : [...p.badges, id],
    }));
  };

  // ── streak update ─────────────────────────────────────────────
  const updateStreak = () => {
    setProgress(p => {
      const today = todayStr();
      if (p.lastActiveDate === today) return p; // כבר עודכן היום
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
      const newStreak = p.lastActiveDate === yesterday ? (p.streak ?? 0) + 1 : 1;
      return { ...p, lastActiveDate: today, streak: newStreak };
    });
    // badge streak
    const s = (progress.streak ?? 0) + 1;
    if (s >= 3) awardBadge('streak_3');
    if (s >= 7) awardBadge('streak_7');
  };

  const completeLesson = (id: number) => {
    updateStreak();
    setProgress(p => ({
      ...p,
      completedLessons: p.completedLessons.includes(id) ? p.completedLessons : [...p.completedLessons, id],
    }));
    // badges
    const done = progress.completedLessons.length + 1;
    if (done >= 1) awardBadge('first_lesson');
    if (done >= 5) awardBadge('five_lessons');
    if (done >= 10) awardBadge('all_lessons');
  };

  const addSearch = (q: string) => {
    updateStreak();
    setProgress(p => ({
      ...p,
      searchHistory: [q, ...p.searchHistory.slice(0, 49)],
    }));
    if (progress.searchHistory.length === 0) awardBadge('first_search');
    if (progress.searchHistory.length >= 49) awardBadge('dict_explorer');
  };

  const addCodeAttempt = (attempt: UserProgress['codeAttempts'][0]) => {
    updateStreak();
    setProgress(p => ({
      ...p,
      codeAttempts: [attempt, ...p.codeAttempts.slice(0, 99)],
    }));
    const tries = progress.codeAttempts.length + 1;
    if (tries >= 1)  awardBadge('first_code');
    if (tries >= 10) awardBadge('ten_code');
  };

  const addQuizScore = (correct: number, _total: number) => {
    setProgress(p => ({
      ...p,
      quizScore: (p.quizScore ?? 0) + correct,
    }));
  };

  const estimateLevel = (): string => {
    const done = progress.completedLessons.length;
    const successful = progress.codeAttempts.filter(a => a.status === 'success').length;
    if (done >= 8 && successful >= 10) return 'מתקדמת בסיסית';
    if (done >= 4 && successful >= 5) return 'בסיסית';
    return 'מתחילה';
  };

  const getWeakTopics = (): string[] => {
    const cats = progress.codeAttempts.filter(a => a.status === 'error').map(a => a.relatedTopics).flat();
    const counts: Record<string, number> = {};
    cats.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
    return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k]) => k);
  };

  const getEarnedBadges = (): BadgeInfo[] =>
    ALL_BADGES.filter(b => progress.badges.includes(b.id));

  return {
    progress, completeLesson, addSearch, addCodeAttempt, addQuizScore,
    estimateLevel, getWeakTopics, getEarnedBadges,
    streak: progress.streak ?? 0,
    quizScore: progress.quizScore ?? 0,
  };
}
