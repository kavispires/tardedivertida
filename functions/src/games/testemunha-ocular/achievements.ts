// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * TESTEMUNHA_OCULAR ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Testemunha Ocular game
 */
const testemunhaOcularAchievements = achievementBuilder(GAME_KEYS.TESTEMUNHA_OCULAR)
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

export const { constants, setupAchievements, pushAchievement, setTruthyAchievement, calculateAchievements } =
  testemunhaOcularAchievements;
