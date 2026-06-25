// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * MESMICE ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Mesmice game
 */
const mesmiceAchievements = achievementBuilder('MESMICE')
  .counter('safeVotes', {
    doc: 'Times voted for the safe choice',
    most: 'MOST_SAFE_VOTES',
  })
  .counter('groupVotes', {
    doc: 'Times voted with the group',
    most: 'MOST_GROUP_VOTES',
  })
  .counter('lonelyVotes', {
    doc: 'Times voted alone',
    most: 'MOST_LONELY_VOTES',
  })
  .counter('targetVotes', {
    doc: 'Times voted for the target option',
    most: 'MOST_TARGET_VOTES',
  })
  .counter('communityVotes', {
    doc: 'Total community points earned from votes',
    most: 'MOST_COMMUNITY_VOTES',
    least: 'FEWEST_COMMUNITY_VOTES',
  })
  .counter('score', {
    doc: 'Final score (individual points)',
    most: 'MOST_INDIVIDUAL_POINTS',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } =
  mesmiceAchievements;
