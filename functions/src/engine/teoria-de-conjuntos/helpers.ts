import { OUTCOME, TEORIA_DE_CONJUNTOS_ACHIEVEMENTS, TEORIA_DE_CONJUNTOS_PHASES } from './constants';
import type { DiagramArea, FirebaseStoreData, Guess, TeoriaDeConjuntosAchievement } from './types';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  currentGuess: Partial<Guess>,
  turnOrder: PlayerId[] = [],
  activePlayerId: PlayerId = '',
): string => {
  const { RULES, SETUP, JUDGE_SELECTION, ITEM_PLACEMENT, EVALUATION, GAME_OVER } = TEORIA_DE_CONJUNTOS_PHASES;
  const order = [RULES, SETUP, JUDGE_SELECTION, ITEM_PLACEMENT, EVALUATION, GAME_OVER];

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

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return ITEM_PLACEMENT;
};

export const createVennDiagram = (hasContextArea: boolean): Collection<DiagramArea> => {
  const areas: Collection<DiagramArea> = {};

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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<TeoriaDeConjuntosAchievement>[] = [];

  // MOST_ATTRIBUTE_CIRCLE
  const { most: mostAttributeCircle } = utils.achievements.getMostAndLeastOf(store, 'attributeCircle');
  if (mostAttributeCircle) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.MOST_ATTRIBUTE_CIRCLE,
      playerId: mostAttributeCircle.playerId,
      value: mostAttributeCircle.value,
    });
  }

  // MOST_WORD_CIRCLE
  const { most: mostWordCircle } = utils.achievements.getMostAndLeastOf(store, 'wordCircle');
  if (mostWordCircle) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.MOST_WORD_CIRCLE,
      playerId: mostWordCircle.playerId,
      value: mostWordCircle.value,
    });
  }

  // MOST_CONTEXT_CIRCLE
  const { most: mostContextCircle } = utils.achievements.getMostAndLeastOf(store, 'contextCircle');
  if (mostContextCircle) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.MOST_CONTEXT_CIRCLE,
      playerId: mostContextCircle.playerId,
      value: mostContextCircle.value,
    });
  }

  // MOST_OUTSIDE
  const { most: mostOutside } = utils.achievements.getMostAndLeastOf(store, 'outside');
  if (mostOutside) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.MOST_OUTSIDE,
      playerId: mostOutside.playerId,
      value: mostOutside.value,
    });
  }

  // MOST_INTERSECTIONS
  const { most: mostIntersections } = utils.achievements.getMostAndLeastOf(store, 'intersection');
  if (mostIntersections) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.MOST_INTERSECTIONS,
      playerId: mostIntersections.playerId,
      value: mostIntersections.value,
    });
  }

  // THE_JUDGE
  const { most: theJudge } = utils.achievements.getMostAndLeastOf(store, 'judge');
  if (theJudge) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.THE_JUDGE,
      playerId: theJudge.playerId,
      value: theJudge.value,
    });
  }

  // MOST_WRONG
  const { most: mostWrong } = utils.achievements.getMostAndLeastOf(store, 'wrong');
  if (mostWrong) {
    achievements.push({
      type: TEORIA_DE_CONJUNTOS_ACHIEVEMENTS.MOST_WRONG,
      playerId: mostWrong.playerId,
      value: mostWrong.value,
    });
  }

  return achievements;
};
