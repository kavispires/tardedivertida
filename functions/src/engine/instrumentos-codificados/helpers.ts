// Constantes
import { DIGITS, INSTRUMENTOS_CODIFICADOS_PHASES, TOTAL_ROUNDS } from './constants';
import { sampleSize } from 'lodash';
// Helpers
import utils from '../../utils';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
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

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds a random code fragment consisting of 3 digits
 */
export const buildCodeFragment = () => {
  return sampleSize(DIGITS, 3).map((n) => `${n}`);
};

/**
 * Builds the complete code by combining player fragments in order
 * @param players - The collection of players in the game
 * @param playerCount - The number of players in the game
 */
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

/**
 * Builds the table of cards mapped to digit indices
 * @param cards - The array of card IDs
 */
export const buildTable = (cards: UID[]) => {
  return cards.map((cardId, index) => ({
    digit: index,
    cardId,
  }));
};
