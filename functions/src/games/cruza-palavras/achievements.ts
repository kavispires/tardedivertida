// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * CRUZA PALAVRAS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Cruza Palavras game
 */
const achievements = achievementBuilder('CRUZA_PALAVRAS')
  .counter('clues', {
    doc: 'Clues that players guessed correctly',
    most: 'BEST_CLUES',
  })
  .counter('badClues', {
    doc: 'Clues that resulted in negative points',
    most: 'WORST_CLUES',
  })
  .counter('guesses', {
    doc: 'Correct guesses made',
    most: 'BEST_GUESSER',
    least: 'WORST_GUESSER',
  })
  .counter('wordLength', {
    doc: 'Total length of clue words',
    most: 'LONGEST_WORDS',
    least: 'SHORTEST_WORDS',
  })
  .counter('chooseForMe', {
    doc: 'Times using auto-fill feature',
    most: 'CHOOSE_FOR_ME',
  })
  .counter('savior', {
    doc: 'Only player guessing someone elses clue correctly preventing them to lose points',
    most: 'SAVIOR',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
