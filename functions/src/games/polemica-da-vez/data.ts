// Types
import type { CustomDeck } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
// Services
import { fetchResource } from '../../services/resource';

/**
 * Get tweet cards resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Custom deck of tweet cards
 */
export const getTweets = async (language: string) => {
  return await fetchResource<CustomDeck>(TDR_RESOURCES.TWEETS, language);
};
