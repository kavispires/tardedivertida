// Tool Kits
import { achievementBuilder } from '../../utils/tool-kits';

/**
 * METALINGUAGEM ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Metalinguagem game
 */
const metalinguagemAchievements = achievementBuilder('METALINGUAGEM')
  .counter('twoCorrect', {
    doc: 'Number of times player guessed both words correctly',
    most: 'MOST_TWO_CORRECT_GUESSES',
    least: 'FEWEST_TWO_CORRECT_GUESSES',
  })
  .counter('oneCorrect', {
    doc: 'Number of times player guessed one word correctly',
    most: 'MOST_ONE_CORRECT_GUESSES',
    least: 'FEWEST_ONE_CORRECT_GUESSES',
  })
  .counter('zeroCorrect', {
    doc: 'Number of times player guessed no words correctly',
    most: 'MOST_ZERO_CORRECT_GUESSES',
    least: 'FEWEST_ZERO_CORRECT_GUESSES',
  })
  .counter('wordLengths', {
    doc: 'Total word lengths across all submitted words',
    most: 'LONGEST_WORDS',
    least: 'SHORTEST_WORDS',
  })
  .array('bestWords', {
    doc: 'Quality scores of submitted words',
    average: {
      most: 'BEST_WORDS',
      least: 'WORST_WORDS',
    },
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  metalinguagemAchievements;
