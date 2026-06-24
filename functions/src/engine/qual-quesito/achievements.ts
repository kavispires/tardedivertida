// Tool Kits
import { achievementBuilder } from '../../utils/tool-kits';

/**
 * QUAL_QUESITO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Qual Quesito game
 */
const qualQuesitoAchievements = achievementBuilder('QUAL_QUESITO')
  .counter('creatorExtra', {
    doc: 'Added extra cards when the creator',
    most: 'MOST_CREATOR_EXTRA_CARDS',
  })
  .counter('skipTurn', {
    doc: 'Count how many times the player skipped their turn as the creator',
    most: 'MOST_SKIPS',
  })
  .counter('joiners', {
    doc: 'How many players joined your category when you were the creator',
    most: 'BEST_CREATOR',
    least: 'WORST_CREATOR',
  })
  .counter('participation', {
    doc: 'Participation during rounds where they were not the creator',
    most: 'MOST_PARTICIPATION',
    least: 'LEAST_PARTICIPATION',
  })
  .counter('rejections', {
    doc: 'How many times their things were rejected',
    most: 'MOST_REJECTIONS',
    least: 'FEWEST_REJECTIONS',
  })
  .counter('acceptance', {
    doc: 'How many times their things were accepted',
    most: 'MOST_ACCEPTANCE',
    least: 'LEAST_ACCEPTANCE',
  })
  .counter('accepting', {
    doc: 'How many times the player have accepted other players things',
    most: 'MOST_ACCEPTING',
  })
  .counter('declining', {
    doc: 'How many times the player have declined other players things',
    most: 'MOST_DECLINING',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  qualQuesitoAchievements;
