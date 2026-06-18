/**
 * COLEGAS DE QUARTO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Colegas de Quarto game
 */
const achievements = achievementBuilder('COLEGAS_DE_QUARTO')
  .counter('guessed', {
    doc: 'Number of clues guessed by other players',
    most: 'BEST_CLUES',
    least: 'WORST_CLUES',
  })
  .counter('soloGuessed', {
    doc: 'Times having a clue guessed by only one player',
    most: 'SOLO_GUESSED',
  })
  .counter('soloGuess', {
    doc: 'Times being the only one to guess a clue correctly',
    most: 'SOLO_GUESSER',
  })
  .counter('finalItems', {
    doc: 'Number of items remaining at the end of the game',
    most: 'MOST_FINAL_ITEMS',
    least: 'FEWEST_FINAL_ITEMS',
  })
  .counter('wordLength', {
    doc: 'Total length of all clue words',
    most: 'LONGEST_WORDS',
    least: 'SHORTEST_WORDS',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
