// Helpers
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import { buildUsedCardsIdsDict } from './helpers';
import { TestemunhaOcularEntry } from './interfaces';

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
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR, {});
  return {
    allCards,
    usedCards: Object.keys(usedCards),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveUsedQUestions = async (pastQuestions: TestemunhaOcularEntry[]) => {
  // Save usedTestemunhaOcularCards to global
  const usedTestemunhaOcularCards = buildUsedCardsIdsDict(pastQuestions);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR,
    usedTestemunhaOcularCards
  );
};
