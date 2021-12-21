// Types
import { ImageCard, Players } from '../../utils/types';
// Constantes
import { DIGITS, INSTRUMENTOS_CODIFICADOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (currentPhase: string, currentRound: number): string => {
  const {
    RULES,
    SETUP,
    HINT_GIVING,
    HINT_RECEIVING,
    GUESS_THE_CODE,
    SOLUTION,
    GAME_OVER,
  } = INSTRUMENTOS_CODIFICADOS_PHASES;
  const order = [RULES, SETUP, HINT_GIVING, HINT_RECEIVING, GUESS_THE_CODE, SOLUTION, GAME_OVER];

  if (currentPhase === HINT_RECEIVING && currentRound === TOTAL_ROUNDS) {
    return GUESS_THE_CODE;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return HINT_GIVING;
};

export const buildCodeFragment = () => {
  return gameUtils.getRandomItems(DIGITS, 3).map((n) => `${n}`);
};

export const buildCode = (players: Players, playerCount: number): string[] => {
  const arrayOrder = new Array(playerCount);

  Object.values(players).forEach((player) => {
    arrayOrder[player.order] = player.fragment;
  });

  return arrayOrder.reduce((acc, item) => {
    if (item) {
      item.forEach((digit) => acc.push(digit));
    }

    return acc;
  }, []);
};

export const buildTable = (cards: ImageCard[]) => {
  return cards.map((cardId, index) => ({
    digit: index,
    cardId,
  }));
};
