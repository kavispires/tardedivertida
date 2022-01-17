// Types
import { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: string): Promise<ResourceData> => {
  const resourceName = `linhas-cruzadas-${language}`;
  // Get full deck
  const allWords = await resourceUtils.fetchResource(resourceName);

  return {
    allWords,
  };
};
