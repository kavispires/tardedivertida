// Helpers
import * as resourceUtils from '../resource';

/**
 * Get word cards resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: string) => {
  const resourceName = `ue-so-isso-${language}`;
  return await resourceUtils.fetchResource(resourceName);
};
