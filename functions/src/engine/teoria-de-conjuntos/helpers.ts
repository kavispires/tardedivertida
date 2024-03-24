import { OUTCOME, TEORIA_DE_CONJUNTOS_PHASES } from './constants';
import { DiagramArea, Guess } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  currentGuess: Partial<Guess>
): string => {
  const { RULES, SETUP, JUDGE_SELECTION, ITEM_PLACEMENT, EVALUATION, GAME_OVER } = TEORIA_DE_CONJUNTOS_PHASES;
  const order = [RULES, SETUP, JUDGE_SELECTION, ITEM_PLACEMENT, EVALUATION, GAME_OVER];

  if (currentPhase === EVALUATION) {
    // TODO: round count check is wrong
    return currentGuess.outcome === OUTCOME.WIN ||
      round.forceLastRound ||
      (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : ITEM_PLACEMENT;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return ITEM_PLACEMENT;
};

export const createVennDiagram = (hasContextArea: boolean): Collection<DiagramArea> => {
  const areas: Collection<DiagramArea> = {};

  const area: DiagramArea = {
    key: '',
    itemsIds: [],
  };

  // Always include 'A' and 'W'
  areas['A'] = { ...area, key: 'A' };
  areas['W'] = { ...area, key: 'W' };
  // Intersection
  areas['AW'] = { ...area, key: 'AW' };

  // Include 'C' if hasContextArea is true
  if (hasContextArea) {
    areas['C'] = { ...area, key: 'C' };

    // Intersections
    areas['AC'] = { ...area, key: 'AC' };
    areas['WC'] = { ...area, key: 'WC' };
    areas['AWC'] = { ...area, key: 'AWC' };
  }

  // Outside area
  areas['O'] = { ...area, key: 'O' };

  return areas;
};

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
