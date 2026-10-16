/**
 * Generator for data.ts file
 */

const { convertToPascalCase } = require('../utils.cjs');

/**
 * Generates the contents of data.ts
 * @param {Object} metadata - Game metadata
 * @returns {string} File contents
 */
function generateData(metadata) {
  const { gameName } = metadata;
  const pascalName = convertToPascalCase(gameName);

  return `// Types
import type { ResourceData, ${pascalName}Options } from './types';

/**
 * Get game resources based on the game's language
 * @param _language - The language code for localized resources
 * @param _options - Game options that may affect resource loading
 * @returns Resource data containing game-specific resources
 */
export const getData = async (_language: Language, _options: ${pascalName}Options): Promise<ResourceData> => {
  // TODO: Implement resource loading

  return {};
};

/**
 * Save used game resources
 * @param _language - The language code for the saved data
 * @param _data - Game-specific data to save
 * @returns Completion of the resource-saving hook.
 */
export const saveData = async (_language: Language, _data: PlainObject) => {
  // TODO: Implement data saving logic
};
`;
}

module.exports = {
  generateData,
};
