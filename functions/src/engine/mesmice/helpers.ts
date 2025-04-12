import { MESMICE_ACHIEVEMENTS, MESMICE_PHASES, OUTCOME } from './constants';
import type {
  ExtendedObjectFeatureCard,
  FirebaseStoreData,
  MesmiceAchievements,
  MesmiceGalleryEntry,
  Outcome,
} from './types';
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
  playerCount: number,
): string => {
  const { LOBBY, SETUP, CLUE_WRITING, OBJECT_FEATURE_ELIMINATION, RESULT, GAME_OVER } = MESMICE_PHASES;
  const order = [LOBBY, SETUP, CLUE_WRITING, OBJECT_FEATURE_ELIMINATION, RESULT, GAME_OVER];

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

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
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
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<MesmiceAchievements>[] = [];

  // Most Safe Votes
  const { most: mostSafeVotes } = utils.achievements.getMostAndLeastOf(store, 'safeVotes');
  if (mostSafeVotes) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_SAFE_VOTES,
      playerId: mostSafeVotes.playerId,
      value: mostSafeVotes.value,
    });
  }

  // Most Target Votes
  const { most: mostTargetVotes } = utils.achievements.getMostAndLeastOf(store, 'targetVotes');
  if (mostTargetVotes) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_TARGET_VOTES,
      playerId: mostTargetVotes.playerId,
      value: mostTargetVotes.value,
    });
  }

  // Most Group Votes
  const { most: mostGroupVotes } = utils.achievements.getMostAndLeastOf(store, 'groupVotes');
  if (mostGroupVotes) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_GROUP_VOTES,
      playerId: mostGroupVotes.playerId,
      value: mostGroupVotes.value,
    });
  }

  // Most Lonely Votes
  const { most: mostLonelyVotes } = utils.achievements.getMostAndLeastOf(store, 'lonelyVotes');
  if (mostLonelyVotes) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_LONELY_VOTES,
      playerId: mostLonelyVotes.playerId,
      value: mostLonelyVotes.value,
    });
  }

  // Most and Least Community Votes
  const { most: mostCommunityVotes, least: leastCommunityVotes } = utils.achievements.getMostAndLeastOf(
    store,
    'communityVotes',
  );

  if (mostCommunityVotes) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_COMMUNITY_VOTES,
      playerId: mostCommunityVotes.playerId,
      value: mostCommunityVotes.value,
    });
  }

  if (leastCommunityVotes) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.FEWEST_COMMUNITY_VOTES,
      playerId: leastCommunityVotes.playerId,
      value: leastCommunityVotes.value,
    });
  }

  // Most Individual Points
  const { most: mostIndividualPoints } = utils.achievements.getMostAndLeastOf(store, 'score');

  if (mostIndividualPoints) {
    achievements.push({
      type: MESMICE_ACHIEVEMENTS.MOST_INDIVIDUAL_POINTS,
      playerId: mostIndividualPoints.playerId,
      value: mostIndividualPoints.value,
    });
  }

  return achievements;
};

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
