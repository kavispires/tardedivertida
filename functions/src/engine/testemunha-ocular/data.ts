// Helpers
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import * as utils from '../../utils/helpers';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import { TestemunhaOcularEntry } from './types';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestionsAndSuspects = async (language: string) => {
  const resourceName = `testemunha-ocular-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR, {});
  // Get images info
  const allSuspects = await resourceUtils.fetchTDIData('us/info');

  return {
    allCards,
    allSuspects: Object.values(allSuspects),
    usedCards: Object.keys(usedCards),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveUsedQUestions = async (pastQuestions: TestemunhaOcularEntry[]) => {
  // Save usedTestemunhaOcularCards to global
  const usedTestemunhaOcularCards = utils.buildUsedCardsIdsDict(pastQuestions);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR,
    usedTestemunhaOcularCards
  );
};
