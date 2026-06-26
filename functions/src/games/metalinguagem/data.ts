import { sampleSize } from 'lodash';
// Types
import type { MetalinguagemOptions, ResourceData } from './types';
// Constants
import { ITEMS_PER_ROUND, MAX_ROUNDS } from './constants';
// Resources
import { getItems } from '../../mechanics/resources';

/**
 * Get items for the game
 * @param options - Game options including NSFW setting
 * @returns Resource data containing dream and meta items
 */
export const getResourceData = async (options: MetalinguagemOptions): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  const itemsNeeded = MAX_ROUNDS * ITEMS_PER_ROUND;

  const dreamItems = await getItems(Math.ceil(itemsNeeded / 0.7), {
    allowNSFW,
    decks: ['dream'],
    cleanUp: (item) => {
      return {
        id: item.id,
        name: item.name,
      };
    },
  });

  const metaItems = await getItems(Math.ceil(itemsNeeded / 0.3), {
    allowNSFW,
    decks: ['meta'],
  });

  return {
    items: sampleSize([...dreamItems, ...metaItems], itemsNeeded),
  };
};
