/**
 * TESTEMUNHA_OCULAR ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Testemunha Ocular game
 */
const testemunhaOcularAchievements = achievementBuilder('TESTEMUNHA_OCULAR')
  .truthy('witness', {
    doc: 'witness',
    key: 'PLAYED_AS_WITNESS',
  })
  .array('releases', {
    doc: 'releases',
    average: { most: 'BEST_QUESTIONS', least: 'MOST_USELESS_QUESTIONS' },
    requiresExclusions: true,
  })
  .truthy('foundThePerpetrator', {
    doc: 'foundThePerpetrator',
    key: 'FOUND_THE_PERPETRATOR',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  push: pushAchievement,
  setTruthy: setTruthyAchievement,
  calculate: getAchievements,
} = testemunhaOcularAchievements;
