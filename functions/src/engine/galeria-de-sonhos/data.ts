// Constants
import { TDR_RESOURCES } from '../../utils/constants';
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
  const resourceName = `${TDR_RESOURCES.WORDS}-${language}`;
  // Get full deck
  const allWords = await resourceUtils.fetchResource(resourceName);

  return {
    allWords,
  };
};
