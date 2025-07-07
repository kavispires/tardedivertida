// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
import type { TextCard } from '../../types/tdr';
// Utils
import utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get resource data for the game
 * @param language
 */
export const getResourceData = async (language: Language): Promise<ResourceData> => {
  // Text cards to make the pool
  const allWords = await utils.tdr.getSingleWords(language);
  // Descriptors to make the metrics
  const allDescriptors = await resourceUtils.fetchResource<Dictionary<TextCard>>(
    TDR_RESOURCES.DESCRIPTORS,
    language,
  );

  return { allWords: Object.values(allWords), allDescriptors: Object.values(allDescriptors) };
};
