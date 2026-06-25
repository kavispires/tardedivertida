// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * UE_SO_ISSO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Ue So Isso game
 */
const ueSoIssoAchievements = achievementBuilder('UE_SO_ISSO')
  .counter('eliminatedClues', {
    doc: 'how many clues were eliminated',
    most: 'MOST_ELIMINATED_CLUES',
    least: 'FEWEST_ELIMINATED_CLUES',
  })
  .counter('clueLength', {
    doc: 'the length of clue words',
    most: 'LONGEST_CLUES',
    least: 'SHORTEST_CLUES',
  })
  .counter('passes', {
    doc: 'how many times pressed pass when it was the guesser',
    most: 'MOST_PASSES',
  })
  .counter('cluesGiven', {
    doc: 'how many clues were given',
    most: 'MOST_CLUES_GIVEN',
    least: 'FEWEST_CLUES_GIVEN',
  })
  .array('correctGuesses', {
    doc: 'Correct guesses with fewest clues',
    unique: { least: 'BEST_GUESSER' },
    qualifier: (v) => v > 0,
  })
  .array('wrongGuesses', {
    doc: 'Wrong guesses with most clues',
    unique: { most: 'WORST_GUESSER' },
    qualifier: (v) => v > 0,
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  ueSoIssoAchievements;
