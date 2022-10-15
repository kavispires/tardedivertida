// Types
import type { ResourceData, TestemunhaOcularEntry } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { QUESTION_COUNT } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestionsAndSuspects = async (language: string): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR, {});
  // Get images info
  const allSuspects = await resourceUtils.fetchTDIData('us/info');

  // Filter out used cards
  const availableCards: Record<string, TestimonyQuestionCard> = utils.game.filterOutByIds(
    allCards,
    usedCards
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCards).length < QUESTION_COUNT) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR);
    return {
      allCards,
      allSuspects: Object.values(allSuspects),
    };
  }

  return {
    allCards: availableCards,
    allSuspects: Object.values(allSuspects),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveUsedQUestions = async (pastQuestions: TestemunhaOcularEntry[]) => {
  // Save usedTestemunhaOcularCards to global
  const usedTestemunhaOcularCards = utils.helpers.buildIdDictionary(pastQuestions);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.TESTEMUNHA_OCULAR,
    usedTestemunhaOcularCards
  );
};
