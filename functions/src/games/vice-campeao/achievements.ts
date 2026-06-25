// Tool Kits
import { achievementBuilder } from '../../utils/tool-kits';

/**
 * VICE_CAMPEAO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Vice Campeao game
 */
const viceCampeaoAchievements = achievementBuilder('VICE_CAMPEAO')
  .counter('first', {
    doc: 'how many rounds the player finished in first place',
    most: 'MOST_FIRST_PLACE',
  })
  .counter('second', {
    doc: 'how many rounds the player finished in second place',
    most: 'MOST_SECOND_PLACE',
  })
  .counter('third', {
    doc: 'how many rounds the player finished in third place',
    most: 'MOST_THIRD_PLACE',
  })
  .counter('last', {
    doc: 'how many rounds the player finished in last place',
    most: 'MOST_LAST_PLACE',
  })
  .counter('secondToLast', {
    doc: 'how many rounds the player finished in second to last place',
    most: 'MOST_SECOND_TO_LAST_PLACE',
  })
  .counter('noMovement', {
    doc: 'how many rounds the player made no movement',
    most: 'MOST_NO_MOVEMENT',
  })
  .counter('selfCards', {
    doc: 'how many cards the player played that affected themselves',
    most: 'MOST_SELF_CARDS',
    least: 'MOST_OTHER_CARDS',
  })
  .counter('movement', {
    doc: 'total distance traveled during the race',
    most: 'MOST_MOVEMENT',
    least: 'LEAST_MOVEMENT',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } =
  viceCampeaoAchievements;
