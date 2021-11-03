// Helpers
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestions = async (language: string) => {
  const resourceName = `testemunha-ocular-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData('usedTestemunhaOcularCards', {});
  return {
    allCards,
    usedCards: Object.keys(usedCards),
  };
};
