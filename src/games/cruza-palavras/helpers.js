import { SEPARATOR } from '../../utils/constants';

/**
 * Checks if an instance is a clue
 * @param {*} instance
 * @returns
 */
export const isClue = (instance) => Boolean(instance?.clue);

/**
 *
 * @param {object} clueObj
 * @returns {string}
 */
export const getClueKey = (clueObj) => `${clueObj.clue}${SEPARATOR}${clueObj.playerId}`;

/**
 *
 * @param {string} key
 * @returns {string[]}
 */
export const getClueFromKey = (key) => key.split(SEPARATOR) ?? ['', ''];
