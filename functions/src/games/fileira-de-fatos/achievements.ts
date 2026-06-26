// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * FILEIRA DE FATOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Fileira de Fatos game
 */
const achievements = achievementBuilder(GAME_KEYS.FILEIRA_DE_FATOS)
  .counter('first', {
    doc: 'Correct guesses on the first position',
    most: 'MOST_FIRST_POSITIONS',
    least: 'FEWEST_FIRST_POSITIONS',
  })
  .counter('second', {
    doc: 'Correct guesses on the second position',
    most: 'MOST_SECOND_POSITIONS',
    least: 'FEWEST_SECOND_POSITIONS',
  })
  .counter('third', {
    doc: 'Correct guesses on the third position',
    most: 'MOST_THIRD_POSITIONS',
    least: 'FEWEST_THIRD_POSITIONS',
  })
  .counter('fourth', {
    doc: 'Correct guesses on the fourth position',
    most: 'MOST_FOURTH_POSITIONS',
    least: 'FEWEST_FOURTH_POSITIONS',
  })
  .counter('fifth', {
    doc: 'Correct guesses on the fifth position',
    most: 'MOST_FIFTH_POSITIONS',
    least: 'FEWEST_FIFTH_POSITIONS',
  })
  .counter('sense', {
    doc: 'Correct guesses on their own scenarios',
    most: 'BEST_COMMON_SENSE',
    least: 'WORST_COMMON_SENSE',
  })
  .counter('perfect', {
    doc: 'Perfect guesses (all positions correct)',
    most: 'PERFECT_GUESS',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
