// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Helpers
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
// Internal
import { buildUsedQuestionIdsDict } from './helpers';

/**
 * Get question cards resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestions = async (language: string) => {
  const resourceName = `mente-coletiva-${language}`;
  // Get full deck
  const allQuestions = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedQuestions = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.MENTE_COLETIVA, {});
  return {
    allQuestions,
    usedQuestions: Object.keys(usedQuestions),
  };
};

/**
 * Save past past questions to global document
 * @param pastQuestions
 */
export const saveUsedQuestions = async (pastQuestions: string[]) => {
  // Save usedMenteColetivaQuestions to global
  const usedMenteColetivaQuestions = buildUsedQuestionIdsDict(pastQuestions);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.MENTE_COLETIVA, usedMenteColetivaQuestions);
};
