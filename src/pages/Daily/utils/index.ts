import moment from 'moment';
import { isDevEnv } from 'utils/helpers';

/**
 * Returns the current date in the format 'YYYY-MM-DD'.
 *
 * @returns {string} The current date in 'YYYY-MM-DD' format.
 */
export function getToday(): string {
  if (isDevEnv) return '2023-10-31';
  return moment().format('YYYY-MM-DD');
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
 * Writes a heart result string based on the number of remaining hearts and total hearts.
 *
 * @param remainHearts - The number of remaining hearts.
 * @param totalHearts - The total number of hearts.
 * @returns The heart result string.
 */
export function writeHeartResultString(remainHearts: number, totalHearts: number): string {
  const heartsValue = Math.max(0, remainHearts);
  return (
    Array(heartsValue).fill('❤️').join('') +
    Array(totalHearts - heartsValue)
      .fill('🩶')
      .join('')
  );
}

/**
 * Pauses the execution for a specified duration.
 * @param duration - The duration to wait in milliseconds. Default is 1000ms.
 */
export const wait = async (duration = 1000) => {
  await new Promise((resolve) => setTimeout(resolve, duration));
};
