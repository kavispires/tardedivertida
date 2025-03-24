import type { Item } from '../../types/tdr';
import type { MetalinguagemOptions, ResourceData } from './types';
import utils from '../../utils';
import { ITEMS_PER_ROUND, MAX_ROUNDS } from './constants';

/**
 * Get items for the game
 * @param options
 * @returns
 */
export const getResourceData = async (options: MetalinguagemOptions): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  const itemsNeeded = MAX_ROUNDS * ITEMS_PER_ROUND;

  const dreamItems = await utils.tdr.getItems(Math.ceil(itemsNeeded / 0.7), {
    allowNSFW,
    decks: ['dream'],
  });

  const metaItems = await utils.tdr.getItems(Math.ceil(itemsNeeded / 0.3), {
    allowNSFW,
    decks: ['meta'],
  });

  return {
    items: utils.game.getRandomItems(
      [...dreamItems, ...metaItems].map((item: Item) => item.id),
      itemsNeeded,
    ),
  };
};
