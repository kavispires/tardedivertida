// Tool Kits
import { achievementBuilder } from '../../utils/tool-kits';

/**
 * LABIRINTO SECRETO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Labirinto Secreto game
 */
const achievements = achievementBuilder('LABIRINTO_SECRETO')
  .counter('adjectives', {
    doc: 'Total number of clue cards used',
    most: 'MOST_CARDS',
    least: 'FEWEST_CARDS',
  })
  .counter('negatives', {
    doc: 'Total number of negated clue cards used',
    most: 'MOST_NEGATIVE_CARDS',
    least: 'FEWEST_NEGATIVE_CARDS',
  })
  .counter('distance', {
    doc: 'Total number of trees walked through',
    most: 'MOST_TREES',
    least: 'FEWEST_TREES',
  })
  .counter('guided', {
    doc: 'Times player was successfully guided by others',
    most: 'BEST_MAP',
    least: 'WORST_MAP',
  })
  .counter('guide', {
    doc: 'Times player successfully guided others',
    most: 'BEST_SCOUT',
    least: 'WORST_SCOUT',
  })
  .counter('up', {
    doc: 'Number of UP movements',
    most: 'MOST_UP',
  })
  .counter('down', {
    doc: 'Number of DOWN movements',
    most: 'MOST_DOWN',
  })
  .counter('left', {
    doc: 'Number of LEFT movements',
    most: 'MOST_LEFT',
  })
  .counter('right', {
    doc: 'Number of RIGHT movements',
    most: 'MOST_RIGHT',
  })
  .counter('upLeft', {
    doc: 'Number of UP_LEFT movements',
    most: 'MOST_UP_LEFT',
  })
  .counter('upRight', {
    doc: 'Number of UP_RIGHT movements',
    most: 'MOST_UP_RIGHT',
  })
  .counter('downLeft', {
    doc: 'Number of DOWN_LEFT movements',
    most: 'MOST_DOWN_LEFT',
  })
  .counter('downRight', {
    doc: 'Number of DOWN_RIGHT movements',
    most: 'MOST_DOWN_RIGHT',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
