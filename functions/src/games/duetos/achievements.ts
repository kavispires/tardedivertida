// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * DUETOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Duetos game
 */
const achievements = achievementBuilder('DUETOS')
  .counter('alone', {
    doc: 'Times having no matches with any player',
    most: 'MOST_ALONE',
  })
  .counter('duos', {
    doc: 'Times pairing with exactly one other player',
    most: 'MOST_DUOS',
  })
  .counter('groups', {
    doc: 'Times pairing with more than one other player',
    most: 'MOST_GROUPS',
  })
  .counter('leftOut', {
    doc: 'Times being left out while others paired',
    most: 'MOST_LEFT_OUT',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
