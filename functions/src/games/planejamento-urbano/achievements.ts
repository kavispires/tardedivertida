// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * PLANEJAMENTO_URBANO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Planejamento Urbano game
 */
const planejamentoUrbanoAchievements = achievementBuilder('PLANEJAMENTO_URBANO')
  .counter('coneA', {
    doc: 'Left the cone A without a location',
    most: 'MOST_CONE_A_LEFT',
  })
  .counter('coneB', {
    doc: 'Left the cone B without a location',
    most: 'MOST_CONE_B_LEFT',
  })
  .counter('coneC', {
    doc: 'Left the cone C without a location',
    most: 'MOST_CONE_C_LEFT',
  })
  .counter('coneD', {
    doc: 'Left the cone D without a location',
    most: 'MOST_CONE_D_LEFT',
  })
  .counter('architectMatches', {
    doc: 'Got the correct location matching the architect',
    most: 'MOST_ARCHITECT_MATCHES',
  })
  .counter('playersMatches', {
    doc: 'Got the correct location matching other players',
    most: 'MOST_OTHER_PLAYERS_MATCHES',
  })
  .counter('soloMatches', {
    doc: 'Got the correct location without matching anyone',
    most: 'MOST_SOLO_GUESSES',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  planejamentoUrbanoAchievements;
