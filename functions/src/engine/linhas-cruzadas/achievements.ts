/**
 * LINHAS CRUZADAS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Linhas Cruzadas game
 */
const linhasCruzadasAchievements = achievementBuilder('LINHAS_CRUZADAS')
  .counter('drawingDuration', {
    doc: 'Time taken to complete drawing',
    most: 'QUICKEST_DRAWER',
    least: 'SLOWEST_DRAWER',
  })
  .counter('writingDuration', {
    doc: 'Time taken to write guess',
    most: 'QUICKEST_GUESSER',
    least: 'SLOWEST_GUESSER',
  })
  .counter('randomPromptSelection', {
    doc: 'Number of random prompt selections',
    most: 'RANDOM_PROMPT_SELECTION',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } =
  linhasCruzadasAchievements;
