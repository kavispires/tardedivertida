// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import * as resourceUtils from '../resource';
import type { CustomDeck } from './types';

/**
 * Get tweet cards resource based on the game's language
 * @param language
 * @returns
 */
export const getTweets = async (language: string) => {
  return await resourceUtils.fetchResource<CustomDeck>(TDR_RESOURCES.TWEETS, language);
};
