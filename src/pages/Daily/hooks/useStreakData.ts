import { useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Utils
import { getToday } from '@utils/helpers';
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
    const { currentStreak, lastCelebratedMilestone } = streakData;
    const today = getToday();

    // Check if we've reached a NEW milestone (higher than the last celebrated one)
    const milestones = [3, 7, 14, 30, 50, 100, 200, 365];
    let newMilestone: number | null = null;

    // Find the highest milestone reached that hasn't been celebrated yet
    for (let i = milestones.length - 1; i >= 0; i--) {
      const milestone = milestones[i];
      if (
        currentStreak >= milestone &&
        (lastCelebratedMilestone === null || milestone > lastCelebratedMilestone)
      ) {
        newMilestone = milestone;
        break;
      }
    }

    // Only show modal if there's a new milestone to celebrate
    if (newMilestone !== null) {
      setCurrentMilestone(newMilestone);
      // Update both the last displayed date and the celebrated milestone
      saveStreakData({
        ...streakData,
        lastMilestoneModalDisplayedDate: today,
        lastCelebratedMilestone: newMilestone,
      });
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
