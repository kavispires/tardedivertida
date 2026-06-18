/**
 * ONDA_TELEPATICA ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Onda Telepatica game
 */
const ondaTelepaticaAchievements = achievementBuilder('ONDA_TELEPATICA')
  .counter('exact', {
    doc: 'exact',
    most: 'MOST_EXACT',
  })
  .counter('accuracy', {
    doc: 'accuracy',
    most: 'MOST_ACCURATE',
    least: 'LEAST_ACCURATE',
  })
  .counter('zero', {
    doc: 'zero',
    most: 'MOST_ZEROS',
  })
  .counter('psychicPoints', {
    doc: 'psychicPoints',
    most: 'BEST_PSYCHIC',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
} = ondaTelepaticaAchievements;
