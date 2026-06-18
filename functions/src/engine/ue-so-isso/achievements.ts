/**
 * UE_SO_ISSO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Ue So Isso game
 */
const uesoissoAchievements = achievementBuilder('UE_SO_ISSO')
  .counter('eliminatedClues', {
    doc: 'eliminatedClues',
    most: 'TBD',
  })
  .counter('clueLength', {
    doc: 'clueLength',
    most: 'TBD',
  })
  .counter('passes', {
    doc: 'passes',
    most: 'TBD',
  })
  .array('correctGuesses', {
    doc: 'correctGuesses',
    uniqueItems: { most: 'TBD' },
  })
  .array('wrongGuesses', {
    doc: 'wrongGuesses',
    uniqueItems: { most: 'TBD' },
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
} = uesoissoAchievements;
