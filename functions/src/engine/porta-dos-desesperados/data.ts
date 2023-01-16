// Constants
import { TOTAL_IMAGE_CARDS } from './constants';
// Types
import type { ResourceData } from './types';
// Helpers
import utils from '../../utils';

/**
 * Get image decks card
 * @param originalDecksOnly
 * @returns
 */
export const getData = async (originalDecksOnly: boolean): Promise<ResourceData> => {
  // Get image cards
  const cards = await utils.imageCards.getImageCards(TOTAL_IMAGE_CARDS, originalDecksOnly);

  return {
    cards,
  };
};
