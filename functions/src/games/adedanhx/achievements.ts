// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * ADEDANHX ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Adedanhx game
 */
const achievements = achievementBuilder(GAME_KEYS.ADEDANHX)
  .counter('stop', {
    doc: 'Number of times player stopped the game',
    most: 'MOST_STOPS',
    least: 'FEWEST_STOPS',
  })
  .exactMatch('stop', {
    doc: 'Player never stopped the game',
    key: 'NEVER_STOPPED',
    value: 0,
  })
  .counter('first', {
    doc: 'Number of times player answered first/fastest',
    most: 'MOST_FIRST_ANSWERS',
    least: 'LEAST_FIRST_ANSWERS',
  })
  .counter('cells', {
    doc: 'Number of cells answered',
    most: 'MOST_CELLS',
    least: 'FEWEST_CELLS',
  })
  .counter('autoReject', {
    doc: 'Number of answers auto-rejected',
    most: 'MOST_AUTO_REJECTS',
    least: 'FEWEST_AUTO_REJECTS',
  })
  .counter('badClues', {
    doc: 'Number of bad clues given (tracked but not awarded)',
    most: 'MOST_REJECTED_CLUES',
    least: 'FEWEST_REJECTED_CLUES',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
