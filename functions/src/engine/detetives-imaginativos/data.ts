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
 * @param playerCount
 * @param allImageDecks
 * @returns
 */
export const getData = async (players: Players, allImageDecks: boolean): Promise<ResourceData> => {
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  const { gameOrder, playerCount } = utils.players.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);
  const cardsPerPlayer = gameOrder.length * 2 + HAND_LIMIT;
  const minimumNumberOfCards = playerCount * cardsPerPlayer;

  // Get image cards
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards, allImageDecks);

  return {
    cards,
  };
};

export const saveData = async (usedCards: UsedCards[], language: Language) => {
  const usedCardsIds: BooleanDictionary = {};
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
