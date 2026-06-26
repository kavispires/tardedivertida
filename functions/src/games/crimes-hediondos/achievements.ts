// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * CRIMES HEDIONDOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Crimes Hediondos game
 */
const achievements = achievementBuilder(GAME_KEYS.CRIMES_HEDIONDOS)
  .counter('wrongGroups', {
    doc: 'Wrong group guesses',
    most: 'MOST_WRONG_GROUPS',
  })
  .counter('wrong', {
    doc: 'Completely wrong guesses',
    most: 'MOST_WRONG_GUESSES',
  })
  .counter('one', {
    doc: 'One correct item guesses',
    most: 'MOST_ONE_GUESSES',
  })
  .counter('two', {
    doc: 'Two correct items guesses',
    most: 'MOST_TWO_GUESSES',
  })
  .counter('three', {
    doc: 'Three correct items guesses',
    most: 'MOST_THREE_GUESSES',
  })
  .array('correct', {
    doc: 'Completely correct guesses per round',
    indexed: true,
    occurrence: {
      earliest: 'EARLIEST_CORRECT_GUESS',
      latest: 'LATEST_CORRECT_GUESS',
    },
  })
  .array('weapons', {
    doc: 'Weapons selected across rounds',
    unique: {
      most: 'MOST_SELECTED_WEAPONS',
      least: 'FEWEST_SELECTED_WEAPONS',
    },
  })
  .array('evidence', {
    doc: 'Evidence selected across rounds',
    unique: {
      most: 'MOST_SELECTED_EVIDENCE',
      least: 'FEWEST_SELECTED_EVIDENCE',
    },
  })
  .array('victims', {
    doc: 'Victims selected across rounds',
    unique: {
      most: 'MOST_SELECTED_VICTIMS',
      least: 'FEWEST_SELECTED_VICTIMS',
    },
  })
  .array('locations', {
    doc: 'Locations selected across rounds',
    unique: {
      most: 'MOST_SELECTED_LOCATIONS',
      least: 'FEWEST_SELECTED_LOCATIONS',
    },
  })
  .build();

export const {
  constants,
  setupAchievements,
  increaseAchievement,
  pushAchievement,
  insertAchievement,
  calculateAchievements,
} = achievements;
