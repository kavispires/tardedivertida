// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * ARTE RUIM ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Arte Ruim game
 */
const achievements = achievementBuilder('ARTE_RUIM')
  .counter('artistPoints', {
    doc: 'Points from drawings that players guessed correctly',
    most: 'BEST_ARTIST',
  })
  .counter('worstArtist', {
    doc: 'Points from drawings that no players guessed correctly',
    most: 'WORST_ARTIST',
  })
  .counter('solitaryWin', {
    doc: 'Times being the only one to guess a drawing correctly',
    most: 'SOLITARY_WINNER',
  })
  .counter('solitaryFail', {
    doc: 'Times being the only one to guess a drawing incorrectly',
    most: 'SOLITARY_LOSER',
  })
  .counter('tableVotes', {
    doc: 'Votes for non-player cards',
    most: 'TABLE_VOTES',
  })
  .counter('chooseForMe', {
    doc: 'Times giving up on guessing',
    most: 'CHOOSE_FOR_ME',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
