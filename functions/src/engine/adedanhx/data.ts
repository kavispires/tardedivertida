// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
import type { TopicCard } from '../../types/tdr';
// Utils
import * as resourceUtils from '../resource';
import { LETTERS_ENTRIES_BY_LANGUAGE } from './constants';

/**
 * Get topics resource based on the game's language
 * @param language
 * @returns
 */
export const getTopics = async (language: string): Promise<ResourceData> => {
  // Get full deck
  const allTopics = await resourceUtils.fetchResource<Dictionary<TopicCard>>(TDR_RESOURCES.TOPICS, language);

  return { allTopics: Object.values(allTopics), allLetters: LETTERS_ENTRIES_BY_LANGUAGE[language] };
};
