// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: string): Promise<ResourceData> => {
  const resourceNameLC = `${TDR_RESOURCES.WORDS_DRAWING}-${language}`;
  const allWords: Collection<TextCard> = await resourceUtils.fetchResource(resourceNameLC);

  const resourceNameAR = `${TDR_RESOURCES.ARTE_RUIM_CARDS}-${language}`;
  // Get full deck
  const allExpressions: Collection<ArteRuimCard> = await resourceUtils.fetchResource(resourceNameAR);

  return {
    allWords: Object.values(allWords),
    allExpressions: Object.values(allExpressions),
  };
};
