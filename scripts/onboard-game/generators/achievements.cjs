/**
 * Generator for achievements.ts file
 */

const { convertToPascalCase } = require('../utils.cjs');

/**
 * Generates the contents of achievements.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateAchievements(metadata) {
  const { gameKey, gameName } = metadata;
  const pascalName = convertToPascalCase(gameName);

  return `/**
 * ${gameKey} ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { GAME_KEYS } from '../../constants/games';
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * Build achievement utilities for ${pascalName} game
 */
const achievements = achievementBuilder(GAME_KEYS.${gameKey})
  // TODO: Define achievement counters
  // Example:
  // .counter('correctAnswers', {
  //   doc: 'Number of correct answers',
  //   most: 'MOST_CORRECT',
  //   least: 'LEAST_CORRECT',
  // })
  .build();

/**
 * Achievement definitions and tracking helpers configured for \`${gameName}\`.
 */
export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
`;
}

module.exports = {
  generateAchievements,
};
