import { MESMICE_PHASES, OUTCOME } from './constants';
import type { ExtendedObjectFeatureCard, MesmiceGalleryEntry, Outcome } from './types';
import utils from '../../utils';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the round
 * @param playerCount - The number of players in the game
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  outcome: Outcome,
  playerCount: number,
): string => {
  const { SETUP, CLUE_WRITING, OBJECT_FEATURE_ELIMINATION, RESULT, GAME_OVER } = MESMICE_PHASES;
  const order = [SETUP, CLUE_WRITING, OBJECT_FEATURE_ELIMINATION, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    if (
      outcome !== OUTCOME.CONTINUE &&
      (round.forceLastRound || (round.current > 0 && round.current === round.total))
    ) {
      return GAME_OVER;
    }

    if (outcome === OUTCOME.CONTINUE) {
      return OBJECT_FEATURE_ELIMINATION;
    }

    if (outcome === OUTCOME.WIN || outcome === OUTCOME.LOSE) {
      return round.current === playerCount ? CLUE_WRITING : OBJECT_FEATURE_ELIMINATION;
    }
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Determine the outcome of the phase by checking if player eliminated the target or still has features to eliminate
 * @param playersChoice - The ID of the feature chosen by players
 * @param target - The ID of the target feature
 * @param features - The array of feature cards (this function modifies it)
 */
export const determineOutcome = (
  playersChoice: string,
  target: string,
  features: ExtendedObjectFeatureCard[],
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
 * Calculates the final group score and outcome based on gallery history
 * @param gallery - The array of gallery entries with scoring history
 * @param groupScore - The current group score
 */
export const calculateFinalGroupScore = (gallery: MesmiceGalleryEntry[], groupScore: number) => {
  const goal = gallery.reduce((acc, entry) => {
    let count = 0;
    entry.history.forEach((result) => {
      count += result.score;
    });

    return acc + count;
  }, 0);

  const percentage = (groupScore / goal) * 100;

  return {
    goal,
    score: groupScore,
    outcome: percentage >= 70 ? 'WIN' : 'LOSE',
  };
};
