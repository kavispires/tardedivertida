// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import { CARDS_PER_PLAYER } from './constants';
// Types
import type { ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as dataUtils from '../collections';
import * as globalUtils from '../global';

/**
 * Get image decks card
 * @param playerCount
 * @returns
 */
export const getData = async (playerCount: number): Promise<ResourceData> => {
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  // Also add 1 deck (with the double amount of cards) to be used as the table deck
  const minimumNumberOfCards = (playerCount + 2) * CARDS_PER_PLAYER;

  // Get image cards
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards);

  return {
    cards: utils.game.shuffle(cards),
  };
};

export const saveData = async (usedCards: PlainObject[], language: Language) => {
  const usedCardsIds: BooleanDictionary = {};
  const clues = usedCards.reduce((acc, entry) => {
    usedCardsIds[entry.cardId] = true;
    acc[entry.cardId] = [entry.story];
    return acc;
  }, {});

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await dataUtils.updateCardDataCollection('imageCards', language, clues);
};
