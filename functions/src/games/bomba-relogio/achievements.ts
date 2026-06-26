// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * BOMBA RELÓGIO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Bomba Relógio game
 */
const achievements = achievementBuilder(GAME_KEYS.BOMBA_RELOGIO)
  .counter('terrorist', {
    doc: 'Times being a terrorist',
    most: 'SOLO_TERRORIST',
  })
  .counter('terroristBomb', {
    doc: 'Times exploding the bomb as a terrorist',
    most: 'BEST_TERRORIST',
  })
  .counter('agentBomb', {
    doc: 'Times exploding the bomb as an agent',
    most: 'ACCIDENTAL_BOMBER',
  })
  .counter('picked', {
    doc: 'Times being picked for examination',
    most: 'MOST_TRUSTED',
    least: 'LEAST_TRUSTED',
  })
  .counter('wires', {
    doc: 'Red wires drawn',
    most: 'MOST_WIRES',
    least: 'FEWEST_WIRES',
  })
  .counter('blank', {
    doc: 'Blank cards drawn',
    most: 'MOST_BLANKS',
    least: 'FEWEST_BLANKS',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
