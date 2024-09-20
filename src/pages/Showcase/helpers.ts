// Types
import type { GameInfo } from 'types/game-info';

export const filterGames = (list: GameInfo[], filters: PlainObject) => {
  return list.filter((game) => {
    let result: boolean[] = [];
    // Availability
    if (doesExist(filters.availability)) {
      const res = ['beta', 'stable'].includes(game.release);
      result.push(filters.availability === 'on' ? res : !res);
    }

    // Mobile Friendly
    evaluateTag(filters, game, 'mobile-friendly', result);

    // Drawing
    evaluateTag(filters, game, 'drawing', result);

    // Writing
    evaluateTag(filters, game, 'writing', result);

    // Images
    evaluateTag(filters, game, 'images', result);

    // Voting
    evaluateTag(filters, game, 'voting', result);

    // Guessing
    evaluateTag(filters, game, 'guessing', result);

    // Time
    evaluateTag(filters, game, 'timed', result);

    // Pairing
    evaluateTag(filters, game, 'pairing', result);

    // Traitor
    evaluateTag(filters, game, 'traitor', result);

    // Discussion
    evaluateTag(filters, game, 'discussion', result);

    // Push Your Luck
    evaluateTag(filters, game, 'push-your-luck', result);

    // Type
    evaluateCustomTag(filters, game, 'type', result);

    // Rounds
    evaluateCustomTag(filters, game, 'rounds', result);

    return result.every((r) => r);
  });
};

/**
 * Verify if a filter has an boolean value
 * @param property
 * @returns
 */
export const doesExist = (property: any) => property !== undefined && property !== 'any';

/**
 * Verify if a tag is selected updating the result array
 * @param filters
 * @param game
 * @param tagName
 * @param result
 */
export const evaluateTag = (filters: PlainObject, game: GameInfo, tagName: string, result: boolean[]) => {
  if (doesExist(filters[tagName])) {
    const res = game.tags.includes(tagName);
    result.push(filters[tagName] === 'on' ? res : !res);
  }
};

/**
 * Verify is a custom tag (which values is not on or off) is selected updating the result array
 */
export const evaluateCustomTag = (
  filters: PlainObject,
  game: GameInfo,
  tagName: string,
  result: boolean[]
) => {
  if (doesExist(filters[tagName])) {
    const res = game.tags.includes(filters[tagName]);
    result.push(res);
  }
};
