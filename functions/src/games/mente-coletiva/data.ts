// Types
import type { GroupQuestionCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { MAX_ROUNDS, QUESTIONS_PER_ROUND } from './constants';
// Services
import {
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
  fetchGlobalTrackerDocumentData,
} from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Utils
import utils from '../../utils';

/**
 * Get question cards resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing group question cards
 */
export const getQuestions = async (language: string): Promise<ResourceData> => {
  // Get full deck
  const allQuestions = await fetchResource<Dictionary<GroupQuestionCardData>>(
    TDR_RESOURCES.GROUP_QUESTIONS,
    language,
  );
  // Get used deck
  const usedQuestions = await fetchGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.GROUP_QUESTIONS, {});

  // Filter out used cards
  const availableQuestions: Record<string, GroupQuestionCardData> = utils.game.filterOutByIds(
    allQuestions,
    usedQuestions,
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableQuestions).length < QUESTIONS_PER_ROUND * MAX_ROUNDS) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.GROUP_QUESTIONS);
    return { allQuestions };
  }

  return {
    allQuestions: availableQuestions,
  };
};

/**
 * Save past past questions to global document
 * @param pastQuestions - Array of question IDs used in the game
 */
export const saveData = async (pastQuestions: string[]) => {
  const pastQuestionsObj = pastQuestions.reduce((acc: Dictionary<string>[], id: string) => {
    acc.push({ id });
    return acc;
  }, []);

  // Save usedMenteColetivaQuestions to global
  const usedMenteColetivaQuestions = utils.helpers.buildBooleanDictionary(pastQuestionsObj);
  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.GROUP_QUESTIONS, usedMenteColetivaQuestions);
};
