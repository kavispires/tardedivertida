// Types
import type { QualQuesitoOptions, ResourceData } from './types';
// Constants
import { CARDS_PER_PLAYER, DECK_PER_PLAYER } from './constants';
// Resources
import { getItems } from '../../mechanics/resources';

/**
 * Get resource data for the game
 * @param options - Game options including NSFW setting
 * @param playerCount - Number of players in the game
 * @returns Resource data containing items from alien, dream, and evidence decks
 */
export const getResourceData = async (
  options: QualQuesitoOptions,
  playerCount: number,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  const itemsNeeded = playerCount * (CARDS_PER_PLAYER + DECK_PER_PLAYER);

  const items = await getItems(itemsNeeded, {
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
