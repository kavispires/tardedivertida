// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * COMUNICACAO ALIENIGENA ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Comunicacao Alienigena game
 */
const achievements = achievementBuilder('COMUNICACAO_ALIENIGENA')
  .counter('objectInquiries', {
    doc: 'How many objects were inquired by the player',
    most: 'MOST_QUESTIONED_OBJECTS',
    least: 'FEWEST_QUESTIONED_OBJECTS',
    requiresExclusions: true,
  })
  .counter('singleInquiry', {
    doc: 'Inquiring only one object in a round',
    most: 'SINGLE_OBJECT_INQUIRY',
    requiresExclusions: true,
  })
  .counter('correct', {
    doc: 'Most correct offerings',
    most: 'MOST_CORRECT_OBJECTS',
    requiresExclusions: true,
  })
  .counter('blank', {
    doc: 'Most blank offerings',
    most: 'MOST_BLANK_OBJECTS',
    requiresExclusions: true,
  })
  .counter('cursed', {
    doc: 'Most cursed offerings',
    most: 'MOST_CURSED_OBJECTS',
    requiresExclusions: true,
  })
  .truthy('alien', {
    doc: 'Player who played as alien',
    key: 'PLAYED_AS_ALIEN',
  })
  .truthy('human', {
    doc: 'All players who played against the bot alien',
    key: 'PLAYED_AGAINST_BOT_ALIEN',
  })
  .build();

export const {
  constants,
  setupAchievements,
  increaseAchievement,
  calculateAchievements,
  setTruthyAchievement,
} = achievements;
