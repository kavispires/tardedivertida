import { OUTCOME, TEORIA_DE_CONJUNTOS_PHASES } from './constants';
import type { DiagramArea, Guess } from './types';
// Utils
import utils from '../../utils';

/**
 * Determines the next phase based on the current phase and guess state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param currentGuess - The current guess object
 * @param turnOrder - The array of player IDs in turn order
 * @param activePlayerId - The ID of the active player
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  currentGuess: Partial<Guess>,
  turnOrder: UID[] = [],
  activePlayerId: UID = '',
): string => {
  const { SETUP, JUDGE_SELECTION, ITEM_PLACEMENT, EVALUATION, GAME_OVER } = TEORIA_DE_CONJUNTOS_PHASES;
  const order = [SETUP, JUDGE_SELECTION, ITEM_PLACEMENT, EVALUATION, GAME_OVER];

  if (currentPhase === EVALUATION) {
    // If the player has won, go to GAME_OVER
    if (currentGuess.outcome === OUTCOME.WIN) {
      return GAME_OVER;
    }

    const activePlayerIndex = turnOrder.indexOf(activePlayerId);

    // If it's the last player let them finish their turn
    if (activePlayerIndex + 1 === turnOrder.length && currentGuess.outcome !== OUTCOME.CONTINUE) {
      return round.forceLastRound || (round.current > 0 && round.current >= round.total)
        ? GAME_OVER
        : ITEM_PLACEMENT;
    }

    return ITEM_PLACEMENT;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Creates a Venn diagram structure with appropriate areas
 * @param hasContextArea - Whether to include the context area in the diagram
 */
export const createVennDiagram = (hasContextArea: boolean): Dictionary<DiagramArea> => {
  const areas: Dictionary<DiagramArea> = {};

  const area: DiagramArea = {
    key: '',
    itemsIds: [],
  };

  // Always include 'A' and 'W'
  areas.A = { ...area, key: 'A' };
  areas.W = { ...area, key: 'W' };
  // Intersection
  areas.AW = { ...area, key: 'AW' };

  // Include 'C' if hasContextArea is true
  if (hasContextArea) {
    areas.C = { ...area, key: 'C' };

    // Intersections
    areas.AC = { ...area, key: 'AC' };
    areas.WC = { ...area, key: 'WC' };
    areas.AWC = { ...area, key: 'AWC' };
  }

  // Outside area
  areas.O = { ...area, key: 'O' };

  return areas;
};

/**
 * Determines the outcome of a guess based on correctness
 * @param currentGuess - The current guess object
 * @param currentPlayer - The current player object
 */
export const determineOutcome = (currentGuess?: Guess, currentPlayer?: Player): Partial<Guess> => {
  // Beginning of the game
  if (!currentGuess || !currentPlayer) {
    return { outcome: OUTCOME.PENDING };
  }

  if (currentGuess.correctArea) {
    const isCorrect = currentGuess.suggestedArea === currentGuess.correctArea;

    if (isCorrect && currentPlayer.hand.length === 1) {
      return {
        ...currentGuess,
        outcome: OUTCOME.WIN,
      };
    }

    return {
      ...currentGuess,
      outcome: currentGuess.correctArea === currentGuess.suggestedArea ? OUTCOME.CONTINUE : OUTCOME.WRONG,
    };
  }

  return {
    ...currentGuess,
    outcome: OUTCOME.PENDING,
  };
};
