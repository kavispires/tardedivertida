import { useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Utils
import { getToday } from 'utils/helpers';
// Internal
import { loadStreakData, saveStreakData } from '../utils/streakManager';
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

  useEffect(() => {
    const streakData = loadStreakData();
    const { currentStreak, lastMilestoneModalDisplayedDate } = streakData;
    const today = getToday();

    // Only show modal if we haven't shown it today
    if (lastMilestoneModalDisplayedDate !== today) {
      // Check if we've reached a milestone
      const milestones = [3, 7, 14, 30, 50, 100, 200, 365];

      for (const milestone of milestones) {
        if (currentStreak >= milestone) {
          setCurrentMilestone(milestone);
          // Update the last displayed date
          saveStreakData({
            ...streakData,
            lastMilestoneModalDisplayedDate: today,
          });
          break;
        }
      }
    }
  }, []);

  const handleClose = () => {
    setCurrentMilestone(null);
  };

  return {
    milestone: currentMilestone,
    onClose: handleClose,
  };
}
