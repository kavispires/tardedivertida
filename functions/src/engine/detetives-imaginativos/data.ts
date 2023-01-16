// Constants
import { HAND_LIMIT } from './constants';
// Types
import type { ResourceData } from './types';
// Helpers
import utils from '../../utils';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';

/**
 * Get image decks card
 * @param playerCount
 * @param originalDecksOnly
 * @returns
 */
export const getData = async (players: Players, originalDecksOnly: boolean): Promise<ResourceData> => {
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  const { gameOrder, playerCount } = utils.players.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);
  const cardsPerPlayer = gameOrder.length * 2 + HAND_LIMIT;
  const minimumNumberOfCards = playerCount * cardsPerPlayer;

  // Get image cards
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards, originalDecksOnly);

  return {
    cards,
  };
};
