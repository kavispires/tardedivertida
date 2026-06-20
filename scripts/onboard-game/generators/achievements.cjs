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

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for ${pascalName} game
 */
const achievements = achievementBuilder('${gameKey}')
  // TODO: Define achievement counters
  // Example:
  // .counter('correctAnswers', {
  //   doc: 'Number of correct answers',
  //   most: 'MOST_CORRECT',
  //   least: 'LEAST_CORRECT',
  // })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
`;
}

module.exports = {
  generateAchievements,
};
