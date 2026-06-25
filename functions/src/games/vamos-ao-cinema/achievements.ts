// Constants
import { GAME_NAMES } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * VAMOS_AO_CINEMA ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Vamos Ao Cinema game
 */
const vamosAoCinemaAchievements = achievementBuilder(GAME_NAMES.VAMOS_AO_CINEMA)
  .counter('group', {
    doc: 'how many times the player chose the same movie as other players',
    most: 'MOST_GROUP_SELECTIONS',
  })
  .counter('solo', {
    doc: 'how many times the player was the only one to choose a movie',
    most: 'MOST_SOLO_SELECTIONS',
  })
  .counter('couple', {
    doc: 'how many times the player chose the same movie as exactly one other player',
    most: 'MOST_COUPLE_SELECTIONS',
  })
  .counter('bad', {
    doc: "how many times the player chose to eliminate someone else's movie",
    most: 'MOST_BAD_ELIMINATIONS',
  })
  .counter('own', {
    doc: 'how many times the player had their movie eliminated by someone else',
    most: 'MOST_ELIMINATED_MOVIE',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  vamosAoCinemaAchievements;
