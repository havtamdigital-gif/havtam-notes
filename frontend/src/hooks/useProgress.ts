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

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>('havtam_progress_v2', INITIAL);

  const completeLesson = (id: number) => {
    setProgress(p => ({
      ...p,
      completedLessons: p.completedLessons.includes(id) ? p.completedLessons : [...p.completedLessons, id],
    }));
  };

  const addSearch = (q: string) => {
    setProgress(p => ({
      ...p,
      searchHistory: [q, ...p.searchHistory.slice(0, 49)],
    }));
  };

  const addCodeAttempt = (attempt: UserProgress['codeAttempts'][0]) => {
    setProgress(p => ({
      ...p,
      codeAttempts: [attempt, ...p.codeAttempts.slice(0, 99)],
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

  return { progress, completeLesson, addSearch, addCodeAttempt, estimateLevel, getWeakTopics };
}
