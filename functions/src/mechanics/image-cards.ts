import { shuffle } from 'lodash';
// Types
import type { ImageDecksData } from '../types/tdr';
// Services
import { throwHttpsError } from '../services/firebase-core';
import { fetchResource } from '../services/resource';

/**
 * Image Cards Mechanics
 * Handles fetching and distribution of image card decks for games
 */

/**
 * Cache for generated decks to avoid regenerating the same deck multiple times
 */
const deckCache = {};

/**
 * Generates an array of card IDs for a given deck prefix and quantity
 * Card IDs are formatted as '{prefix}-{number}' with zero-padding for single digits
 * @param deckPrefix - The prefix identifier for the deck
 * @param quantity - The number of cards to generate in the deck
 * @returns Array of card IDs
 */
const generateDeck = (deckPrefix: string, quantity: number) => {
  return new Array(quantity).fill(1).map((item, index) => {
    const tempId = item + index;
    const id = tempId < 10 ? `0${tempId}` : tempId;
    return `${deckPrefix}-${id}`;
  });
};

/**
 * Fetches image deck metadata and validates that enough cards are available
 * Throws an error if the requested quantity exceeds available cards
 * @param minimumQuantity - The minimum number of cards required
 * @returns Object containing shuffled deck names and card information
 */
async function fetchImageDecksCardsData(
  minimumQuantity: number,
): Promise<{ decks: string[]; cardInfo: ImageDecksData }> {
  const cardInfo = await fetchResource<ImageDecksData>('images-decks');

  const decks = Object.keys(cardInfo);
  const totalCards = Number(Object.values(cardInfo ?? {}).reduce((acc: number, num) => acc + num, 0));
  if (minimumQuantity > totalCards) {
    throwHttpsError(
      `${minimumQuantity} image cards were requested but the game only has ${totalCards} available`,
      'get image cards decks',
    );
  }

  return {
    decks: shuffle(decks),
    cardInfo,
  };
}

/**
 * Gets cards from decks of image cards
 * Selects enough decks to meet the required quantity and returns shuffled cards
 * @param quantity - The number of cards needed
 * @returns Array of shuffled card IDs
 */
export const getImageCards = async (quantity: number): Promise<UID[]> => {
  const { decks, cardInfo } = await fetchImageDecksCardsData(quantity);

  const selectedDecks: string[] = [];
  let selectedCardQuantity = 0;
  while (selectedCardQuantity < quantity) {
    const currentDeck = decks.pop();
    if (currentDeck) {
      selectedDecks.push(currentDeck);
      selectedCardQuantity += cardInfo[currentDeck];
    }
  }

  const cards = selectedDecks.map((deckPrefix) => {
    if (deckCache[deckPrefix] === undefined) {
      deckCache[deckPrefix] = generateDeck(deckPrefix, cardInfo[deckPrefix]);
    }

    return deckCache[deckPrefix];
  });

  return shuffle(cards.reduce((acc, val) => acc.concat(val), []));
};

/**
 * Gets several image card decks
 * Each deck is kept separate as an array, useful when games need distinct deck sets
 * @param quantity - The number of decks to retrieve
 * @returns Array of shuffled card deck arrays
 */
export const getImageCardsDecks = async (quantity: number): Promise<UID[][]> => {
  const { decks, cardInfo } = await fetchImageDecksCardsData(quantity);

  const selectedDecks = Array(quantity)
    .fill(0)
    .map((_, index) => decks[index]);

  const cards = selectedDecks.map((deckPrefix) => {
    if (deckCache[deckPrefix] === undefined) {
      deckCache[deckPrefix] = generateDeck(deckPrefix, cardInfo[deckPrefix]);
    }

    return deckCache[deckPrefix];
  });

  return shuffle(cards);
};
