import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch { return initial; }
  });
  const set = (v: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return [value, set] as const;
}
