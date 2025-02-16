// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ArteRuimCard, TextCard } from '../../types/tdr';
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: string): Promise<ResourceData> => {
  const allWords = await resourceUtils.fetchResource<Dictionary<TextCard>>(
    TDR_RESOURCES.DRAWING_WORDS,
    language,
  );

  // Get full deck
  const allExpressions = await resourceUtils.fetchResource<Dictionary<ArteRuimCard>>(
    TDR_RESOURCES.ARTE_RUIM_CARDS,
    language,
  );

  return {
    allWords: Object.values(allWords),
    allExpressions: Object.values(allExpressions),
  };
};
