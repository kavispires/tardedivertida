// Constantes
import { DIGITS, INSTRUMENTOS_CODIFICADOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, HINT_GIVING, HINT_RECEIVING, GUESS_THE_CODE, SOLUTION, GAME_OVER } =
    INSTRUMENTOS_CODIFICADOS_PHASES;
  const order = [SETUP, HINT_GIVING, HINT_RECEIVING, GUESS_THE_CODE, SOLUTION, GAME_OVER];

  if (currentPhase === HINT_RECEIVING && round.current === TOTAL_ROUNDS) {
    return GUESS_THE_CODE;
  }

  if (currentPhase === GUESS_THE_CODE && round.forceLastRound) {
    return GAME_OVER;
  }

  return utils.helpers.nextPhaseDelegator(currentPhase, order);
};

export const buildCodeFragment = () => {
  return utils.game.getRandomItems(DIGITS, 3).map((n) => `${n}`);
};

export const buildCode = (players: Players, playerCount: number): string[] => {
  const arrayOrder = new Array(playerCount);

  utils.players.getListOfPlayers(players).forEach((player) => {
    arrayOrder[player.order] = player.fragment;
  });

  return arrayOrder.reduce((acc, item) => {
    if (item) {
      item.forEach((digit) => {
        acc.push(digit);
      });
    }

    return acc;
  }, []);
};

export const buildTable = (cards: UID[]) => {
  return cards.map((cardId, index) => ({
    digit: index,
    cardId,
  }));
};
