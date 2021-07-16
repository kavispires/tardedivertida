import * as gameUtils from './game-utils';

const DECKS = ['dc-b1', 'dc-b2', 'dx-mr', 'my-pr'];

export const IMAGE_CARDS_PER_DECK = 84;

const deckCache = {};

export const getImageCards = (numDecks = 1) => {
  const decks = gameUtils.shuffle(DECKS);
  const selectedDecks = new Array(numDecks).fill('').map((item, index) => `${item}${decks[index]}`);

  const cards = selectedDecks.map((deckPrefix) => {
    if (deckCache[deckPrefix] === undefined) {
      deckCache[deckPrefix] = new Array(IMAGE_CARDS_PER_DECK).fill(1).map((item, index) => {
        const tempId = item + index;
        const id = tempId < 10 ? `0${tempId}` : tempId;
        return `${deckPrefix}-${id}`;
      });
    }

    return deckCache[deckPrefix];
  });

  return cards.reduce((acc, val) => acc.concat(val), []);
};
