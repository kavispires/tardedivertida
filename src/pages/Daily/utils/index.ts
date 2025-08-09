import { USE_FIRESTORE_EMULATOR } from 'dev-configs';
import moment from 'moment';
// Utils
import { isDevEnv } from 'utils/helpers';
// Internal
import type { BasicResultsOptions, WithRequiredId } from './types';
import { getSettings } from './settings';

/**
 * Returns the current date in the format 'YYYY-MM-DD'.
 *
 * @returns The current date in 'YYYY-MM-DD' format.
 */
export function getToday(): string {
  if (isDevEnv && USE_FIRESTORE_EMULATOR) return '2023-10-31';
  return moment().format('YYYY-MM-DD');
}

/**
 * Checks if a given date is a Saturday or Sunday.
 *
 * @param dateString - The date in 'YYYY-MM-DD' format.
 * @returns True if the date is a Saturday or Sunday, false otherwise.
 */
export function checkWeekend(dateString: string): boolean {
  const date = moment(dateString, 'YYYY-MM-DD');
  return [6, 0].includes(date.day()); // 0 represents Sunday and 6 represents Saturday in moment.js
}

/**
 * Checks if the given release date is after the current date.
 *
 * @param releaseDate - The release date in 'YYYY-MM-DD' format.
 * @returns `true` if the release date is after the current date, otherwise `false`.
 */
export function hasBeenReleased(releaseDate: string): boolean {
  if (releaseDate === 'DEMO') return true;
  return moment(releaseDate, 'YYYY-MM-DD').isAfter(moment().format('YYYY-MM-DD'));
}

/**
 * Calculates the number of days since the given release date.
 *
 * @param releaseDate - The release date in the format 'YYYY-MM-DD'.
 * @returns The number of days since the release date.
 */
export function daysSinceRelease(releaseDate: string): number {
  return moment().diff(moment(releaseDate, 'YYYY-MM-DD'), 'days');
}

/**
 * TEMPORARY: Returns the date from today based on the given number of days.
 * @param days
 * @returns
 */
export function getDateFromToday(days: number): string {
  const today = moment().format('YYYY-MM-DD');
  return moment(today, 'YYYY-MM-DD').subtract(days, 'days').format('YYYY-MM-DD');
}

/**
 * Calculates the day of the year for a given date.
 *
 * @param today - The date for which to calculate the day of the year.
 * @returns The day of the year as a number.
 */
export function getDayOfYear(): number {
  const date = new Date(getToday());
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns the source name based on the given language.
 * @param language The language code ('pt' for Portuguese, 'en' for English).
 * @returns The source name ('diario' for Portuguese, 'daily' for English).
 */
export function getSourceName(language: Language) {
  return language === 'pt' ? 'diario' : 'daily';
}

/**
 * Returns the title name based on the given language.
 * @param language - The language code ('pt' for Portuguese, 'en' for English).
 * @returns The title name in the corresponding language.
 */
export function getDailyName(language: Language) {
  return language === 'pt' ? 'TD Diário' : 'TD Daily';
}

/**
 * Pauses the execution for a specified duration.
 * @param duration - The duration to wait in milliseconds. Default is 1000ms.
 */
export const wait = async (duration = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};

/**
 * Composes a key for storing a value in local storage for today's date.
 * @param key - The game key to compose.
 * @returns The composed key for today's date.
 */
export const composeLocalTodayKey = (key: string) => `TD_DAILY_${key}_LOCAL_TODAY`;

/**
 * Composes a local played key for the daily feature.
 * @param key - The key to compose the local played key for.
 * @returns The composed local played key.
 */
export const composeLocalPlayedKey = (key: string) => `TD_DAILY_${key}_LOCAL_PLAYED`;

/**
 * Composes the analytics event name for a specific key and action.
 * @param key - The key to compose the analytics event name for.
 * @param action - The action to include in the event name ('win' or 'lose' or 'played').
 * @returns The composed analytics event name.
 */
export const getAnalyticsEventName = (key: string, action: 'win' | 'lose' | 'played' | 'game_suggestion') =>
  `daily_${key}_${action}`;

/**
 * Checks if a specific key was played today.
 * @param key - The key to check.
 * @returns A boolean indicating whether the key was played today.
 */
export const checkWasPlayedToday = (key: string): boolean => {
  const localKey = composeLocalTodayKey(key);
  const session = JSON.parse(localStorage.getItem(localKey) || '{}');
  const playedKey = composeLocalPlayedKey(key);
  const played = JSON.parse(localStorage.getItem(playedKey) || 'false');
  const today = getToday();
  const isToday = session?.id === today;
  if (!isToday) {
    localStorage.setItem(playedKey, JSON.stringify(false));
    return false;
  }

  return session?.id === today && played;
};

/**
 * Loads the locally stored data for today's game based on the provided key and game ID.
 * If the locally stored data is not valid or does not match the provided game ID, it resets the data to the provided default value.
 * @param options - The options for loading the local data.
 * @param options.key - The key used to identify the local data.
 * @param options.gameId - The ID of the game.
 * @param options.defaultValue - The default value for the local data.
 * @returns The locally stored data for today's game.
 */
export function loadLocalToday<TLocal extends WithRequiredId>({
  key,
  gameId,
  defaultValue,
}: {
  key: string;
  gameId: string;
  defaultValue: TLocal;
}): TLocal {
  const localKey = composeLocalTodayKey(key);
  const previouslyStored = JSON.parse(localStorage.getItem(localKey) ?? '{}');

  const isDefaultValueValid = Object.keys(defaultValue).every((k) => k in previouslyStored);

  if (!isDefaultValueValid || previouslyStored.id !== gameId) {
    const newLocalToday = { ...defaultValue, id: gameId };
    localStorage.setItem(localKey, JSON.stringify(newLocalToday));
    return newLocalToday;
  }

  return previouslyStored;
}

/**
 * Writes a heart result string based on the number of remaining hearts and total hearts.
 *
 * @param remainHearts - The number of remaining hearts.
 * @param totalHearts - The total number of hearts.
 * @returns The heart result string.
 */
export function writeHeartResultString(remainHearts: number, totalHearts: number, separator = ''): string {
  const heartsValue = Math.max(0, remainHearts);
  const maxHeartsValue = Math.max(heartsValue, totalHearts);
  return [...Array(heartsValue).fill('❤️'), ...Array(maxHeartsValue - heartsValue).fill('🩶')].join(separator);
}

export function generateShareableResult(
  args: Prettify<
    BasicResultsOptions & {
      /**
       * Additional lines to include in the result
       */
      additionalLines: string[];
      /**
       * Additional content in the same line as the hearts result
       */
      heartsSuffix?: string;
      /**
       * Spacing between each heart (usually a space)
       */
      heartsSpacing?: string;
    }
  >,
) {
  const {
    type,
    language,
    challengeNumber,
    remainingHearts,
    totalHearts,
    title,
    heartsSuffix = '',
    heartsSpacing = '',
    additionalLines = [],
    hideLink = false,
    hideHearts = false,
  } = args;

  const settings = getSettings(type);

  return [
    `${settings.EMOJI} ${getDailyName(language)} ${settings.NAME[language]} #${challengeNumber}`,
    title,
    !hideHearts && `${writeHeartResultString(remainingHearts, totalHearts, heartsSpacing)} ${heartsSuffix}`,
    ...additionalLines,
    !hideLink && `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ]
    .filter(Boolean)
    .map((line) => (line as string).trim())
    .join('\n');
}
