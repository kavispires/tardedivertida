import fetch from 'cross-fetch';
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

const generateDeck = (deckPrefix: string, quantity: number) => {
  return new Array(quantity).fill(1).map((item, index) => {
    const tempId = item + index;
    const id = tempId < 10 ? `0${tempId}` : tempId;
    return `${deckPrefix}-${id}`;
  });
};

/**
 * Gets cards from decks of image cards
 * @param quantity the number of cards needed
 * @returns
 */
export const getImageCards = async (
  quantity: number,
  originalDecksOnly?: boolean
): Promise<ImageCardId[]> => {
  const cardInfo: Record<string, number> = await requestTDIInfo();

  // If only original decks, get decks prefixed with td-
  const availableInfo = originalDecksOnly
    ? Object.keys(cardInfo).reduce((acc: Record<string, number>, key) => {
        if (key.startsWith('td-')) {
          acc[key] = cardInfo[key];
        }
        return acc;
      }, {})
    : cardInfo;

  const decks = Object.keys(availableInfo);
  const totalCards = Number(Object.values(availableInfo ?? {}).reduce((acc: any, num: any) => acc + num, 0));
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
      selectedCardQuantity += availableInfo[currentDeck];
    }
  }

  const cards = selectedDecks.map((deckPrefix) => {
    if (deckCache[deckPrefix] === undefined) {
      deckCache[deckPrefix] = generateDeck(deckPrefix, availableInfo[deckPrefix]);
    }

    return deckCache[deckPrefix];
  });

  return cards.reduce((acc, val) => acc.concat(val), []);
};

/**
 * Get several image card decks
 * @param quantity
 * @returns
 */
export const getImageCardsDecks = async (quantity: number): Promise<ImageCardId[][]> => {
  const cardInfo: any = await requestTDIInfo();

  const decks = Object.keys(cardInfo);
  const totalCards = Number(Object.values(cardInfo ?? {}).reduce((acc: any, num: any) => acc + num, 0));
  if (quantity > totalCards) {
    throwException(`${quantity} image cards were requested but the game only has ${totalCards} available`);
  }

  const shuffledDecks = shuffle(decks);
  const selectedDecks = Array(quantity)
    .fill(0)
    .map((_, index) => shuffledDecks[index]);

  const cards = selectedDecks.map((deckPrefix) => {
    if (deckCache[deckPrefix] === undefined) {
      deckCache[deckPrefix] = generateDeck(deckPrefix, cardInfo[deckPrefix]);
    }

    return deckCache[deckPrefix];
  });

  return cards;
};
