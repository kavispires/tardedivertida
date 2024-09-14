// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { MAX_ROUNDS, QUESTIONS_PER_ROUND } from './constants';
// Types
import { GroupQuestionCard } from '../../types/tdr';
import type { ResourceData } from './types';
// Helpers
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import utils from '../../utils';

/**
 * Get question cards resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestions = async (language: string): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.GROUP_QUESTIONS}-${language}`;
  // Get full deck
  const allQuestions: Collection<GroupQuestionCard> = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedQuestions = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.GROUP_QUESTIONS, {});

  // Filter out used cards
  const availableQuestions: Record<string, GroupQuestionCard> = utils.game.filterOutByIds(
    allQuestions,
    usedQuestions
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableQuestions).length < QUESTIONS_PER_ROUND * MAX_ROUNDS) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.GROUP_QUESTIONS);
    return { allQuestions };
  }

  return {
    allQuestions: availableQuestions,
  };
};

/**
 * Save past past questions to global document
 * @param pastQuestions
 */
export const saveData = async (pastQuestions: string[]) => {
  const pastQuestionsObj = pastQuestions.reduce((acc: StringDictionary[], id: string) => {
    acc.push({ id });
    return acc;
  }, []);

  // Save usedMenteColetivaQuestions to global
  const usedMenteColetivaQuestions = utils.helpers.buildIdDictionary(pastQuestionsObj);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.GROUP_QUESTIONS,
    usedMenteColetivaQuestions
  );
};
