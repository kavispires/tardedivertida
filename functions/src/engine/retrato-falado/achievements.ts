/**
 * RETRATO_FALADO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Retrato Falado game
 */
const retratoFaladoAchievements = achievementBuilder('RETRATO_FALADO')
  .counter('votes', {
    doc: 'total number of votes received',
    most: 'BEST_SKETCHES',
    least: 'WORST_SKETCHES',
  })
  .counter('groupVote', {
    doc: 'total number of group votes received',
    most: 'MOST_GROUP_VOTES',
    least: 'FEWEST_GROUP_VOTES',
  })
  .counter('witnessPick', {
    doc: 'total number of times a player was picked by the witness',
    most: 'WITNESS_PICK',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
} = retratoFaladoAchievements;
