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

  return `// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData, ${pascalName}Options } from './types';
// Utils
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';
import utils from '../../utils';

/**
 * Get game resources based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options that may affect resource loading
 * @returns Resource data containing game-specific resources
 */
export const getData = async (language: Language, options: ${pascalName}Options): Promise<ResourceData> => {
  // TODO: Implement resource loading
  // Example:
  // const resource = await resourceUtils.fetchResource(TDR_RESOURCES.SOME_RESOURCE, language);

  return {};
};

/**
 * Save used game resources
 * @param language - The language code for the saved data
 * @param data - Game-specific data to save
 */
export const saveData = async (language: Language, data: PlainObject) => {
  // TODO: Implement data saving logic
  // Example:
  // const usedIds = utils.helpers.buildBooleanDictionary(Object.keys(data));
  // await utils.tdr.saveUsedResource(usedIds);
  // await dataUtils.updateCardDataCollection('collection-name', language, data);
};
`;
}

module.exports = {
  generateData,
};
