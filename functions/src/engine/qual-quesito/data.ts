// Constants
// Types
import type { QualQuesitoOptions, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { CARDS_PER_PLAYER, DECK_PER_PLAYER } from './constants';

/**
 * Get resource data for the game
 * @param options
 */
export const getResourceData = async (
  options: QualQuesitoOptions,
  playerCount: number,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  const itemsNeeded = playerCount * (CARDS_PER_PLAYER + DECK_PER_PLAYER);

  const items = await utils.tdr.getItems(itemsNeeded, {
    allowNSFW,
    decks: ['alien', 'dream', 'evidence'],
    cleanUp: (item) => {
      return {
        id: item.id,
        name: item.name,
      };
    },
  });

  return {
    allItems: items,
  };
};
