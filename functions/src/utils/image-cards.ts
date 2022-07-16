import fetch from 'cross-fetch';
// Types
import type { ImageCardId } from './types';
// Helpers
import { config, throwException } from './firebase';
import { shuffle } from './game-utils';

const deckCache = {};

const requestTDIInfo = async (): Promise<any> => {
  try {
    const response = await fetch(`${config().td_url.data}info.json`);
    return response.json();
  } catch (e) {
    throwException(`${e}`, 'Failed to get images data');
  }
};

/**
 * Gets cards from decks of image cards
 * @param quantity the number of cards needed
 * @returns
 */
export const getImageCards = async (quantity: number): Promise<ImageCardId[]> => {
  const cardInfo: any = await requestTDIInfo();

  const decks = Object.keys(cardInfo);
  const totalCards = Number(Object.values(cardInfo ?? {}).reduce((acc: any, num: any) => acc + num, 0));
  if (quantity > totalCards) {
    throwException(`${quantity} image cards were requested but the game only has ${totalCards} available`);
  }

  const shuffledDecks = shuffle(decks);
  const selectedDecks: string[] = [];
  let selectedCardQuantity = 0;
  while (selectedCardQuantity < quantity) {
    const currentDeck = shuffledDecks.pop();
    if (currentDeck) {
      selectedDecks.push(currentDeck);
      selectedCardQuantity += cardInfo[currentDeck];
    }
  }

  const cards = selectedDecks.map((deckPrefix) => {
    if (deckCache[deckPrefix] === undefined) {
      deckCache[deckPrefix] = new Array(cardInfo[deckPrefix]).fill(1).map((item, index) => {
        const tempId = item + index;
        const id = tempId < 10 ? `0${tempId}` : tempId;
        return `${deckPrefix}-${id}`;
      });
    }

    return deckCache[deckPrefix];
  });

  return cards.reduce((acc, val) => acc.concat(val), []);
};
