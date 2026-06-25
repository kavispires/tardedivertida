// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * RETRATO_FALADO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

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

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  retratoFaladoAchievements;
