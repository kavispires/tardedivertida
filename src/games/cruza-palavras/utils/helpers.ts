// Utils
import { SEPARATOR } from 'utils/constants';
// Internal
import { Clue } from './types';

/**
 * Checks if an instance is a clue
 * @param instance
 * @returns
 */
export const isClue = (instance?: any) => Boolean(instance?.clue);

/**
 *
 * @param clueObj
 * @returns
 */
export const getClueKey = (clueObj?: Clue): string => `${clueObj?.clue}${SEPARATOR}${clueObj?.playerId}`;

/**
 *
 * @param key
 * @returns
 */
export const getClueFromKey = (key: string): string[] => key.split(SEPARATOR) ?? ['', ''];
