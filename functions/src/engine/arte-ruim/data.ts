// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Helpers
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get expression cards resource based on the game's language
 * @param language
 * @returns
 */
export const getCards = async (language: string) => {
  const resourceName = `arte-ruim-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.ARTE_RUIM, {});
  return {
    allCards,
    usedCards: Object.keys(usedCards),
  };
};
