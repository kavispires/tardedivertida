import { useQuery } from '@tanstack/react-query';
import { random, shuffle } from 'lodash';
// Pages
import { getToday } from 'pages/Daily/utils';

export const PIECES_OPTIONS = [6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 40];
const PIECES_INDEX_STORAGE_KEY = 'TD_DAILY_endless-vitrais-pieces-index';
const PIECES_LAST_DAY_STORAGE_KEY = 'TD_DAILY_endless-vitrais-last-day';

const clampPiecesIndex = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  const index = Math.floor(value);
  if (index < 0 || index >= PIECES_OPTIONS.length) return 0;
  return index;
};

export const getEndlessVitraisPiecesIndex = (): number => {
  if (typeof window === 'undefined') return 0;

  const currentDay = getToday();
  const lastDay = window.localStorage.getItem(PIECES_LAST_DAY_STORAGE_KEY);

  // If it's a new day, reset to first piece count
  if (lastDay !== currentDay) {
    window.localStorage.setItem(PIECES_LAST_DAY_STORAGE_KEY, currentDay);
    window.localStorage.setItem(PIECES_INDEX_STORAGE_KEY, '0');
    return 0;
  }

  const rawValue = window.localStorage.getItem(PIECES_INDEX_STORAGE_KEY);
  if (!rawValue) return 0;
  return clampPiecesIndex(Number(rawValue));
};

export const setEndlessVitraisPiecesIndex = (index: number): void => {
  if (typeof window === 'undefined') return;
  const safeIndex = clampPiecesIndex(index);
  window.localStorage.setItem(PIECES_INDEX_STORAGE_KEY, String(safeIndex));
};

/**
 * Computes the next index following sequential rules, with a random jump after the last item.
 */
export const getNextEndlessVitraisPiecesIndex = (currentIndex: number): number => {
  const safeIndex = clampPiecesIndex(currentIndex);
  if (PIECES_OPTIONS.length <= 1) return safeIndex;
  if (safeIndex >= PIECES_OPTIONS.length - 1) {
    return random(0, PIECES_OPTIONS.length - 1);
  }
  return safeIndex + 1;
};

export function useEndlessVitrais() {
  return useQuery({
    queryKey: ['endless-vitrais'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const num = random(1, 252);
      const deck = `d${random(1, 16)}`;
      const piecesIndex = getEndlessVitraisPiecesIndex();
      const piecesCount = PIECES_OPTIONS[piecesIndex] ?? PIECES_OPTIONS[0];
      return {
        id: 'endless-vitrais',
        number: 0,
        type: 'vitrais',
        title: 'Vitrais Infinitos',
        cardId: `td-${deck}-${num.toString().padStart(2, '0')}`,
        pieces: shuffle(Array.from({ length: piecesCount }, (_, i) => i)),
      };
    },
  });
}
