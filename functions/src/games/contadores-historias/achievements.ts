// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * CONTADORES DE HISTÓRIAS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Contadores de Histórias game
 */
const achievements = achievementBuilder(GAME_KEYS.CONTADORES_HISTORIAS)
  .counter('playerVotes', {
    doc: 'Votes received on player cards when not the storyteller',
    most: 'MOST_DECEIVING',
    least: 'WORST_CARDS',
  })
  .counter('badClues', {
    doc: 'Clues where nobody got it or all got it',
    most: 'WORST_CLUES',
  })
  .counter('easyClues', {
    doc: 'Clues where most or all players got it',
    most: 'EASIEST_CLUES',
    least: 'HARDEST_CLUES',
  })
  .counter('tableVotes', {
    doc: 'Votes on table cards',
    most: 'TABLE_VOTES',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
