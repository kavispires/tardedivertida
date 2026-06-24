// Tool Kits
import { achievementBuilder } from '../../utils/tool-kits';

/**
 * NA RUA DO MEDO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Na Rua do Medo game
 */
const achievements = achievementBuilder('NA_RUA_DO_MEDO')
  .counter('facingMonsters', {
    doc: 'Number of monsters faced during the game',
    most: 'BRAVEST',
    least: 'LUCKIEST',
  })
  .counter('lostCandy', {
    doc: 'Candy lost during scares',
    most: 'CANDY_LOSER',
  })
  .counter('houses', {
    doc: 'Houses visited during trick-or-treating',
    most: 'MOST_HOUSES',
    least: 'MOST_SCARED',
  })
  .counter('jackpots', {
    doc: 'Number of jackpots claimed',
    most: 'MOST_JACKPOTS',
  })
  .counter('sidewalk', {
    doc: 'Candy collected from the sidewalk',
    most: 'MOST_SIDEWALK',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
