import { sampleSize } from 'lodash';
// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import { TRAPS } from './constants';

/**
 * Gets a random door with 33%/66% change of getting the right one
 * @param pages
 * @param trap
 * @returns
 */
export const mockPageSelection = (pages: CardId[], trap: string) => {
  if (trap === TRAPS.MORE_CLUES) {
    return sampleSize(pages, 3);
  }

  return sampleSize(pages, getRandomItem([1, 2]));
};

/**
 * Gets a random door with 33%/66% change of getting the right one
 * @param doors
 * @param answerDoor
 * @returns
 */
export const mockDoorSelection = (doors: CardId[], answerDoor: CardId) => {
  return getRandomItem([...doors, answerDoor, answerDoor]);
};
