import { MESMICE_ACHIEVEMENTS, MESMICE_PHASES, OUTCOME } from './constants';
import { ExtendedObjectFeatureCard, FirebaseStoreData, MesmiceAchievements, Outcome } from './types';
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
  outcome: Outcome,
  playerCount: number
): string => {
  const { RULES, SETUP, CLUE_WRITING, OBJECT_FEATURE_ELIMINATION, RESULT, GAME_OVER } = MESMICE_PHASES;
  const order = [RULES, SETUP, CLUE_WRITING, OBJECT_FEATURE_ELIMINATION, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    if (round.forceLastRound || (round.current > 0 && round.current === round.total)) {
      return GAME_OVER;
    }

    if (outcome === OUTCOME.CONTINUE) {
      return OBJECT_FEATURE_ELIMINATION;
    }

    if (outcome === OUTCOME.WIN || outcome === OUTCOME.LOSE) {
      return round.current === playerCount ? CLUE_WRITING : OBJECT_FEATURE_ELIMINATION;
    }
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return CLUE_WRITING;
};

/**
 * Determine the outcome of the phase
 * It modifies `features`, make sure to save it
 * @param playersChoice
 * @param activePlayer
 * @param features
 * @returns
 */
export const determineOutcome = (
  playersChoice: string,
  target: string,
  features: ExtendedObjectFeatureCard[]
): string => {
  if (playersChoice === target) {
    return OUTCOME.LOSE;
  }

  Object.values(features).forEach((feature) => {
    if (feature.id === playersChoice) {
      feature.eliminated = true;
    }
  });

  const remainingFeatures = Object.values(features).filter((feature) => !feature.eliminated);

  if (remainingFeatures.length === 1) {
    return OUTCOME.WIN;
  }

  return OUTCOME.CONTINUE;
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<MesmiceAchievements>[] = [];

  // Most Stops: stopped the game the most
  const { most: mostStops } = utils.achievements.getMostAndLeastOf(store, 'stop');
  if (mostStops) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_SAFE_VOTES,
      playerId: mostStops.playerId,
      value: mostStops.value,
    });
  }

  return achievements;
};
