// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Helpers
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

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
