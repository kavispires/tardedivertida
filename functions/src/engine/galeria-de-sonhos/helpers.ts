// Types
import { Round } from '../../utils/types';
// Constants
import { GALERIA_DE_SONHOS_PHASES, WORD_DECK_TOTAL } from './constants';
// Utils
import * as utils from '../../utils';
import { AllWords, WordCard } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER } =
    GALERIA_DE_SONHOS_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, DREAMS_SELECTION, CARD_PLAY, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return triggerLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : WORD_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return WORD_SELECTION;
};

const replaceTableCards = (table: string[], newEntries: string[], startingIndex: number): string[] => {
  for (let i = 0; i < newEntries.length; i++) {
    table[i + startingIndex] = newEntries[i];
  }
  return table;
};

export const buildTable = (deck: string[], table: string[], currentRound: number): [string[], string[]] => {
  if (currentRound === 1) {
    // Add 15 cards to table
    const newTable = deck.splice(0, 15);
    return [deck, newTable];
  }

  const newImages = deck.splice(0, 5);
  const startingIndexByRound = [0, 0, 10, 5, 0];
  const newTable = replaceTableCards(table, newImages, startingIndexByRound[currentRound]);

  return [deck, newTable];
};

export const buildDeck = (allWords: AllWords): WordCard[] => {
  return utils.game.getRandomItems(Object.values(allWords), WORD_DECK_TOTAL);
};

export const getRoundWords = (wordsDeck: WordCard[]): [WordCard[], WordCard[]] => {
  const selectedWords = wordsDeck.splice(0, 2);
  return [wordsDeck, selectedWords];
};
