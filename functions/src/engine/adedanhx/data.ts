// Types
import type { TopicCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { LETTERS_ENTRIES_BY_LANGUAGE } from './constants';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get topics resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing topic cards and available letters
 */
export const getTopics = async (language: string): Promise<ResourceData> => {
  // Get full deck
  const allTopics = await resourceUtils.fetchResource<Dictionary<TopicCardData>>(
    TDR_RESOURCES.TOPICS,
    language,
  );

  return { allTopics: Object.values(allTopics), allLetters: LETTERS_ENTRIES_BY_LANGUAGE[language] };
};
