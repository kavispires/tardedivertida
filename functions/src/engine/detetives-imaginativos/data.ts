import { GLOBAL_USED_DOCUMENTS, DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
import { HAND_LIMIT } from './constants';
// Types
import type { ResourceData, UsedCards } from './types';
// Helpers
import utils from '../../utils';
import * as dataUtils from '../collections';
import * as globalUtils from '../global';

/**
 * Get image decks card
 * @param players - Players dictionary for game setup
 * @returns Resource data containing shuffled image card IDs
 */
export const getData = async (players: Players): Promise<ResourceData> => {
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  const { gameOrder, playerCount } = utils.turnOrder.create(players, DOUBLE_ROUNDS_THRESHOLD);
  const cardsPerPlayer = gameOrder.length * 2 + HAND_LIMIT;
  const minimumNumberOfCards = playerCount * cardsPerPlayer;

  // Get image cards
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards);

  return {
    cards,
  };
};

/**
 * Save used image cards and their associated clues
 * @param usedCards - Array of used cards with clues
 * @param language - The language code for the saved data
 */
export const saveData = async (usedCards: UsedCards[], language: Language) => {
  const usedCardsIds: Dictionary<boolean> = {};
  const clues = usedCards.reduce((acc, entry) => {
    (entry.cards ?? []).forEach((cardId) => {
      usedCardsIds[cardId] = true;
      if (entry.isLeader) {
        acc[cardId] = [entry.clue];
      }
    });

    return acc;
  }, {});

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await dataUtils.updateCardDataCollection('imageCards', language, clues);
};
