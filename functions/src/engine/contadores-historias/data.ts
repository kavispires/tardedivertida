// Constants
import { CARDS_PER_PLAYER } from './constants';
// Types
import type { ResourceData } from './types';
// Helpers
import utils from '../../utils';

/**
 * Get image decks card
 * @param playerCount
 * @param originalDecksOnly
 * @returns
 */
export const getData = async (playerCount: number, originalDecksOnly: boolean): Promise<ResourceData> => {
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  // Also add 1 deck (with the double amount of cards) to be used as the table deck
  const minimumNumberOfCards = (playerCount + 2) * CARDS_PER_PLAYER;

  // Get image cards
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards, originalDecksOnly);

  return {
    cards: utils.game.shuffle(cards),
  };
};
