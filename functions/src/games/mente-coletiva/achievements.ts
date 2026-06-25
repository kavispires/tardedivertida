// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * MENTE COLETIVA ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Mente Coletiva game
 */
const menteColetivaAchievements = achievementBuilder('MENTE_COLETIVA')
  .counter('secretScore', {
    doc: 'Final score (total matches)',
    most: 'MOST_MATCHES',
    least: 'FEWEST_MATCHES',
  })
  .counter('distance', {
    doc: 'Total distance traveled between pastures',
    most: 'BEST_TRAVELER',
    least: 'MOST_QUIET',
  })
  .counter('dead', {
    doc: 'Only dead player',
    most: 'MOST_DEAD',
  })
  .counter('lonely', {
    doc: 'Only player without any matches',
    most: 'MOST_LONELY',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } =
  menteColetivaAchievements;
