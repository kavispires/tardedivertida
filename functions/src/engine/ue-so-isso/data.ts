// Types
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import * as resourceUtils from '../resource';

/**
 * Get word cards resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: string) => {
  const resourceName = `${TDR_RESOURCES.SINGLE_WORDS}-${language}`;
  return await resourceUtils.fetchResource(resourceName);
};
