// Types
import type { ArteRuimCardData, TextCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get words resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing drawing words and arte ruim expressions
 */
export const getData = async (language: string): Promise<ResourceData> => {
  const allWords = await resourceUtils.fetchResource<Dictionary<TextCardData>>(
    TDR_RESOURCES.DRAWING_WORDS,
    language,
  );

  // Get full deck
  const allExpressions = await resourceUtils.fetchResource<Dictionary<ArteRuimCardData>>(
    TDR_RESOURCES.ARTE_RUIM_CARDS,
    language,
  );

  return {
    allWords: Object.values(allWords),
    allExpressions: Object.values(allExpressions),
  };
};
