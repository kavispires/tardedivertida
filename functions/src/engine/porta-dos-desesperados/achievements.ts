/**
 * PORTA_DOS_DESESPERADOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Porta Dos Desesperados game
 */
const portaDosDesesperadosAchievements = achievementBuilder('PORTA_DOS_DESESPERADOS')
  .counter('possessions', {
    doc: 'how many times the player was possessed',
    most: 'MOST_POSSESSED',
    least: 'LEAST_POSSESSED',
  })
  .counter('possessionWins', {
    doc: 'how many times the players were successful when this player was possessed',
    most: 'BEST_GUIDE',
  })
  .counter('possessionLosses', {
    doc: 'how many times the players were unsuccessful when this player was possessed',
    most: 'BEGINNER_GUIDE',
  })
  .counter('possessionDuration', {
    doc: 'how long it took for the possessed player to choose pages',
    most: 'SLOW_READER',
    least: 'FAST_LEARNER',
  })
  .counter('pages', {
    doc: 'how many pages the possessed player used',
    most: 'MOST_PAGES',
    least: 'FEWEST_PAGES',
  })
  .counter('correctDoors', {
    doc: 'how many correct doors the player chose',
    most: 'MOST_CORRECT_DOORS',
  })
  .counter('wrongDoors', {
    doc: 'how many wrong doors the player chose',
    most: 'MOST_WRONG_DOORS',
  })
  .counter('soloCorrectDoors', {
    doc: 'how many times they were the only player to select a correct door',
    most: 'MOST_SOLO_CORRECT_DOORS',
  })
  .counter('soloWrongDoors', {
    doc: 'how many times they were the only player to select a wrong door',
    most: 'MOST_SOLO_WRONG_DOORS',
  })
  .counter('doorDuration', {
    doc: 'how long it took for the player to choose doors',
    most: 'SLOW_DECISIONS',
    least: 'QUICK_DECISIONS',
  })
  .counter('magic', {
    doc: 'how much magic crystals were wasted by the player',
    most: 'MAGIC_WASTER',
    least: 'MAGIC_SAVER',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  portaDosDesesperadosAchievements;
