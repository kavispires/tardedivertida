import { useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Internal
import { loadStreakData } from '../utils/streakManager';
import type { DailyStreakData } from '../utils/types';

/**
 * Hook to access current streak data.
 * @returns The current streak data.
 */
export function useStreakData(): DailyStreakData {
  const [streakData, setStreakData] = useState<DailyStreakData>(() => loadStreakData());

  // Reload streak data when component mounts
  useEffectOnce(() => {
    setStreakData(loadStreakData());
  });

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'TD_DAILY_STREAK') {
        setStreakData(loadStreakData());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return streakData;
}

/**
 * Hook to manage streak milestone celebrations.
 * Detects when a milestone is reached and provides modal control.
 * @returns Object with milestone info and modal state.
 */
export function useStreakMilestone() {
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());

  useEffect(() => {
    const streakData = loadStreakData();
    const { currentStreak } = streakData;

    // Check if we've reached a milestone that hasn't been shown yet
    const milestones = [3, 7, 14, 30, 50, 100, 200, 365];

    for (const milestone of milestones) {
      if (currentStreak >= milestone && !shownMilestones.has(milestone)) {
        setCurrentMilestone(milestone);
        setShownMilestones((prev) => new Set(prev).add(milestone));
        break;
      }
    }
  }, [shownMilestones]);

  const handleClose = () => {
    setCurrentMilestone(null);
  };

  return {
    milestone: currentMilestone,
    onClose: handleClose,
  };
}
