// Helpers for image cards
// Helpers
import { throwException } from './firebase';
import { shuffle } from './game-utils';
import { SuspectCard } from '../types/tdr';
import { fetchResource } from '../engine/resource';

const deckCache = {};

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
export const getImageCards = async (quantity: number): Promise<ImageCardId[]> => {
  const cardInfo: Record<string, number> = await fetchResource('images-decks');

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
      deckCache[deckPrefix] = generateDeck(deckPrefix, cardInfo[deckPrefix]);
    }

    return deckCache[deckPrefix];
  });

  return shuffle(cards.reduce((acc, val) => acc.concat(val), []));
};

/**
 * Get several image card decks
 * @param quantity
 * @returns
 */
export const getImageCardsDecks = async (quantity: number): Promise<ImageCardId[][]> => {
  const cardInfo: any = await fetchResource('images-decks');

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

  return shuffle(cards);
};

export const modifySuspectIdsByOptions = (
  suspects: SuspectCard[],
  options: SuspectCardsOptions
): SuspectCard[] => {
  // If only official is requested
  if (options.official && !options.models && !options.wacky && !options.realistic) {
    return suspects;
  }
  let deckType = 'ct';

  if (options.realistic) {
    deckType = 'ai';
  }
  if (options.models) {
    deckType = 'md';
  }
  if (options.wacky) {
    deckType = 'wc';
  }

  return suspects.map((suspect) => ({
    ...suspect,
    id: `us-${deckType}-${suspect.id.split('-')[1]}`,
  }));
};
