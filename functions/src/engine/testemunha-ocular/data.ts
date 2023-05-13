// Types
import type { ResourceData, TestemunhaOcularEntry, TestemunhaOcularOptions } from './types';
// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { QUESTION_COUNT } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';
import { modifySuspectIdsByOptions } from './helpers';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestionsAndSuspects = async (
  language: string,
  options: TestemunhaOcularOptions
): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS, {});
  // Get images info
  const allSuspects = await resourceUtils.fetchTDIData('us/info');

  // Filter out used cards
  const availableCards: Record<string, TestimonyQuestionCard> = utils.game.filterOutByIds(
    allCards,
    usedCards
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCards).length < QUESTION_COUNT) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS);
    return {
      allCards,
      allSuspects: Object.values(allSuspects),
    };
  }

  return {
    allCards: availableCards,
    allSuspects: modifySuspectIdsByOptions(Object.values(allSuspects), options),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveData = async (pastQuestions: TestemunhaOcularEntry[]) => {
  const usedQuestionsIds: BooleanDictionary = {};
  const usedSuspectsIds: BooleanDictionary = {};
  const suspectAnswers: Record<CardId, Record<CardId, boolean>> = {};

  pastQuestions.forEach((entry: PlainObject) => {
    usedQuestionsIds[entry.id] = true;
    if (entry.unfit) {
      entry.unfit.forEach((suspectId: CardId) => {
        usedSuspectsIds[suspectId] = true;

        const previouslySavedCharacter = suspectAnswers?.[suspectId] ?? {};
        suspectAnswers[suspectId] = { ...previouslySavedCharacter, [entry.id]: false };
      });
    }
  });

  // Save used questions
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS, usedQuestionsIds);
  // Save used suspects
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.SUSPECTS, usedSuspectsIds);
  // Save Suspect Answers
  await dataUtils.updateDataFirebaseDoc(DATA_DOCUMENTS.SUSPECT_ANSWERS, suspectAnswers);
};
