// Types
import type { TextCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
// Services
import { fetchResource } from '../../services/resource';
// Resources
import { getSingleWords } from '../../mechanics/resources';

/**
 * Get resource data for the game
 * @param language - The language code for localized resources
 * @returns Resource data containing single words and descriptor cards
 */
export const getResourceData = async (language: Language): Promise<ResourceData> => {
  // Text cards to make the pool
  const allWords = await getSingleWords(language);
  // Descriptors to make the metrics
  const allDescriptors = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.DESCRIPTORS, language);

  return { allWords: Object.values(allWords), allDescriptors: Object.values(allDescriptors) };
};
