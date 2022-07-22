// Constantes
import { DIGITS, INSTRUMENTOS_CODIFICADOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, HINT_GIVING, HINT_RECEIVING, GUESS_THE_CODE, SOLUTION, GAME_OVER } =
    INSTRUMENTOS_CODIFICADOS_PHASES;
  const order = [RULES, SETUP, HINT_GIVING, HINT_RECEIVING, GUESS_THE_CODE, SOLUTION, GAME_OVER];

  if (currentPhase === HINT_RECEIVING && currentRound === TOTAL_ROUNDS) {
    return GUESS_THE_CODE;
  }

  if (currentPhase === GUESS_THE_CODE && triggerLastRound) {
    return GAME_OVER;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return HINT_GIVING;
};

export const buildCodeFragment = () => {
  return utils.game.getRandomItems(DIGITS, 3).map((n) => `${n}`);
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

export const buildTable = (cards: ImageCardId[]) => {
  return cards.map((cardId, index) => ({
    digit: index,
    cardId,
  }));
};
