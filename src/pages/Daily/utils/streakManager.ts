import { parse, subDays, format } from 'date-fns';
// Utils
import { getToday } from '@utils/helpers';
// Internal
import type { DateKey, DailyStreakData } from './types';

const STREAK_KEY = 'TD_DAILY_STREAK';
const MAX_HISTORY_DAYS = 30;

/**
 * Default streak data structure.
 */
const DEFAULT_STREAK_DATA: DailyStreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalDaysPlayed: 0,
  lastPlayedDate: null,
  history: {},
  lastCalculatedDate: null,
  lastMilestoneModalDisplayedDate: null,
  lastCelebratedMilestone: null,
};

/**
 * Loads streak data from localStorage.
 * @returns The streak data object.
 */
export function loadStreakData(): DailyStreakData {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_STREAK_DATA, ...parsed };
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to load streak data:', error);
  }
  return { ...DEFAULT_STREAK_DATA };
}

/**
 * Saves streak data to localStorage.
 * @param data - The streak data to save.
 */
export function saveStreakData(data: DailyStreakData): void {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: error logging
    console.error('Failed to save streak data:', error);
  }
}

/**
 * Checks if the streak is still active based on the last played date.
 * A streak is active if:
 * - Last played was today
 * - Last played was yesterday
 * @param lastPlayedDate - The last date a game was played.
 * @returns True if the streak is active.
 */
export function isStreakActive(lastPlayedDate: DateKey | null): boolean {
  if (!lastPlayedDate) {
    return false;
  }

  const today = getToday();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  return lastPlayedDate === today || lastPlayedDate === yesterday;
}

/**
 * Calculates the current streak from the history.
 * Counts consecutive days backwards from the most recent date.
 * @param history - The play history.
 * @param lastPlayedDate - The most recent date played.
 * @returns The current streak count.
 */
export function calculateStreak(history: DailyStreakData['history'], lastPlayedDate: DateKey | null): number {
  if (!lastPlayedDate) {
    return 0;
  }

  const today = getToday();

  // If last played date is not today or yesterday, streak is broken
  if (!isStreakActive(lastPlayedDate)) {
    return 0;
  }

  let streak = 0;
  let currentDate = today;
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Start from today or yesterday (whichever was last played)
  if (lastPlayedDate === yesterday && !history[today]) {
    currentDate = yesterday;
  }

  // Count backwards from the current date
  while (history[currentDate] && history[currentDate].length > 0) {
    streak++;
    const dateObj = parse(currentDate, 'yyyy-MM-dd', new Date());
    currentDate = format(subDays(dateObj, 1), 'yyyy-MM-dd');
  }

  return streak;
}

/**
 * Updates the streak when a game is completed.
 * @param gameKey - The game key that was completed.
 * @param date - The date the game was completed (defaults to today).
 * @returns The updated streak data with any milestone info.
 */
export function updateStreak(
  gameKey: string,
  date: DateKey = getToday(),
): DailyStreakData & { milestoneReached?: number } {
  const streakData = loadStreakData();
  const today = getToday();

  // Initialize history for this date if it doesn't exist
  if (!streakData.history[date]) {
    streakData.history[date] = [];
  }

  // Add this game to history if not already there
  if (!streakData.history[date].includes(gameKey)) {
    streakData.history[date].push(gameKey);
  }

  // Update last played date
  const isNewDay = streakData.lastPlayedDate !== date;
  streakData.lastPlayedDate = date;

  // Recalculate streak if it's a new day or hasn't been calculated
  if (isNewDay || streakData.lastCalculatedDate !== today) {
    const previousStreak = streakData.currentStreak;
    streakData.currentStreak = calculateStreak(streakData.history, date);
    streakData.lastCalculatedDate = today;

    // Update longest streak if current streak is higher
    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }

    // Check for milestone
    const milestones = [3, 7, 14, 30, 50, 100, 200, 365];
    let milestoneReached: number | undefined;

    for (const milestone of milestones) {
      if (streakData.currentStreak >= milestone && previousStreak < milestone) {
        milestoneReached = milestone;
        break;
      }
    }

    // Update total days played (count unique dates in history)
    streakData.totalDaysPlayed = Object.keys(streakData.history).filter(
      (d) => streakData.history[d].length > 0,
    ).length;

    // Cleanup old history (keep only last MAX_HISTORY_DAYS days)
    cleanupOldHistory(streakData);

    saveStreakData(streakData);

    return { ...streakData, milestoneReached };
  }

  saveStreakData(streakData);
  return streakData;
}

/**
 * Removes history entries older than MAX_HISTORY_DAYS to manage storage size.
 * @param data - The streak data to clean.
 */
function cleanupOldHistory(data: DailyStreakData): void {
  const cutoffDate = format(subDays(new Date(), MAX_HISTORY_DAYS), 'yyyy-MM-dd');

  Object.keys(data.history).forEach((date) => {
    if (date < cutoffDate) {
      delete data.history[date];
    }
  });
}

/**
 * Resets the streak data (useful for testing or user request).
 */
export function resetStreak(): void {
  saveStreakData({ ...DEFAULT_STREAK_DATA });
}

/**
 * Gets a summary of recent activity.
 * @param days - Number of days to include (default: 7).
 * @returns Object with dates and games played on each date.
 */
export function getRecentActivity(days = 7): { date: DateKey; games: string[] }[] {
  const streakData = loadStreakData();
  const today = new Date();
  const activity: { date: DateKey; games: string[] }[] = [];

  for (let i = 0; i < days; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    activity.push({
      date,
      games: streakData.history[date] || [],
    });
  }

  return activity;
}
