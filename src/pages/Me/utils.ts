/**
 * Converts a timestamp (number of milliseconds since January 1, 1970, 00:00:00 UTC) to a string
 * representation of the date in the format "YYYY/MM/DD HH:MM".
 * @param timestamp - The timestamp to convert to a date string.
 * @returns A string representation of the date in the format "YYYY/MM/DD HH:MM".
 */
export function timestampToDate(timestamp: number, includeTime?: false): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  if (!includeTime) {
    return `${year}/${month}/${day}`;
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * Converts a duration in milliseconds to the number of hours.
 *
 * @param duration - The duration to convert, in milliseconds.
 * @returns The number of whole hours represented by the duration.
 */
export function durationToHours(duration: number): number {
  const minutes = Math.floor(duration / 60000);
  const hours = Math.round(minutes / 60);
  if (hours < 1) {
    return minutes / 60;
  }
  return hours;
}
