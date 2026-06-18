/**
 * QUEM_SOU_EU ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Quem Sou Eu game
 */
const quemSouEuAchievements = achievementBuilder('QUEM_SOU_EU')
  .counter('glyphs', {
    doc: 'how many glyphs the player has used',
    most: 'MOST_GLYPHS',
    least: 'LEAST_GLYPHS',
  })
  .counter('positive', {
    doc: 'how many glyphs the player used in the positive side',
    most: 'MOST_POSITIVE',
    least: 'LEAST_POSITIVE',
  })
  .counter('negative', {
    doc: 'how many glyphs the player used in the negative side',
    most: 'MOST_NEGATIVE',
    least: 'LEAST_NEGATIVE',
  })
  .counter('single', {
    doc: 'times the player used a single glyph in a turn',
    most: 'SINGLE_ICON',
  })
  .counter('tableVotes', {
    doc: 'how many times the player voted for a character not belonging to any player',
    most: 'TABLE_VOTES',
  })
  .counter('chooseForMe', {
    doc: 'how many times the player chose the "choose for me" option',
    most: 'CHOOSE_FOR_ME',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  quemSouEuAchievements;
