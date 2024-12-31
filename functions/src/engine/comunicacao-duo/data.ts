import type { ComunicacaoDuoOptions, ResourceData } from './types';
import utils from '../../utils';
import { TOTAL_ITEMS } from './constants';
import { applyDataToDeck } from './helpers';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getDeck = async (options?: ComunicacaoDuoOptions): Promise<ResourceData> => {
  const allowNSFW = !!options?.nsfw;
  const deckType = options?.deckType ?? 'items';

  if (deckType === 'items') {
    const items = await utils.tdr.getItems(TOTAL_ITEMS, {
      allowNSFW,
      decks: ['alien'],
    });

    return { deck: applyDataToDeck(items, 'items') };
  }

  if (deckType === 'images') {
    const images = await utils.imageCards.getImageCards(TOTAL_ITEMS);
    return { deck: applyDataToDeck(images, 'images') };
  }

  return { deck: [] };
};
