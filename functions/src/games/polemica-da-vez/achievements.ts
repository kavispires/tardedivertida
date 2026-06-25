// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * POLEMICA_DA_VEZ ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Polemica Da Vez game
 */
const polemicaDaVezAchievements = achievementBuilder('POLEMICA_DA_VEZ')
  .counter('likes', {
    doc: 'How many things were liked by the player',
    most: 'MOST_LIKER',
    least: 'BIGGEST_HATER',
  })
  .counter('exactGuesses', {
    doc: 'Number of guesses that are exactly the number of likes',
    most: 'MOST_EXACTS',
  })
  .counter('almostGuesses', {
    doc: 'Number of guesses that are off by one from the actual number of likes',
    most: 'MOST_ONE_OFFS',
  })
  .counter('guessDistance', {
    doc: 'Distance between the guessed and actual number of likes',
    most: 'BEST_GUESSES',
    least: 'WORST_GUESSES',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } =
  polemicaDaVezAchievements;
