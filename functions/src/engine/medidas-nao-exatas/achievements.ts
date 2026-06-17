/**
 * MEDIDAS NÃO EXATAS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Medidas Não Exatas game
 */
const achievements = achievementBuilder('MEDIDAS_NAO_EXATAS')
  .counter('doubleGuesses', {
    doc: 'Number of times a player made multiple guesses',
    most: 'MOST_DOUBLE_GUESSES',
    least: 'FEWEST_DOUBLE_GUESSES',
  })
  .counter('level1', {
    doc: 'Number of guesses made at level 1',
    most: 'MOST_LEVEL_1_GUESSES',
  })
  .counter('level2', {
    doc: 'Number of guesses made at level 2',
    most: 'MOST_LEVEL_2_GUESSES',
  })
  .counter('level3', {
    doc: 'Number of guesses made at level 3',
    most: 'MOST_LEVEL_3_GUESSES',
  })
  .counter('level4', {
    doc: 'Number of guesses made at level 4',
    most: 'MOST_LEVEL_4_GUESSES',
  })
  .counter('level5', {
    doc: 'Number of guesses made at level 5',
    most: 'MOST_LEVEL_5_GUESSES',
  })
  .counter('badMetrics', {
    doc: 'Number of rounds as presenter where no one guessed correctly',
    most: 'WORST_METRICS',
  })
  .counter('bestMetrics', {
    doc: 'Number of rounds as presenter where everyone guessed correctly',
    most: 'BEST_METRICS',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  calculate: getAchievements,
} = achievements;
