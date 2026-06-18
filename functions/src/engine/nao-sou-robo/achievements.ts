/**
 * NAO_SOU_ROBO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Nao Sou Robo game
 */
const naoSouRoboAchievements = achievementBuilder('NAO_SOU_ROBO')
  .counter('robot', {
    doc: 'chose robot cards',
    most: 'MOST_ROBOT',
    least: 'LEAST_ROBOT',
  })
  .counter('aloneCorrect', {
    doc: 'got the correct cards by themselves',
    most: 'MOST_ALONE_CORRECT',
  })
  .counter('aloneIncorrect', {
    doc: 'got the incorrect cards by themselves',
    most: 'MOST_ALONE_ROBOT',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  naoSouRoboAchievements;
