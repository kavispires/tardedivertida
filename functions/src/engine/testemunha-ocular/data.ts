// Types
import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import type { ResourceData, TestemunhaOcularEntry, TestemunhaOcularOptions } from './types';
// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { QUESTION_COUNT } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestionsAndSuspects = async (
  language: string,
  options: TestemunhaOcularOptions,
): Promise<ResourceData> => {
  // Get full deck
  const allCards = await resourceUtils.fetchResource<Dictionary<TestimonyQuestionCard>>(
    TDR_RESOURCES.TESTIMONY_QUESTIONS,
    language,
  );
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS, {});
  // Get images info
  const allSuspects = await resourceUtils.fetchResource<Dictionary<SuspectCard>>(TDR_RESOURCES.SUSPECTS);

  // Filter out used cards
  // Filter out used cards
  const availableCards = Object.values(utils.game.filterOutByIds(allCards, usedCards)).filter((card) =>
    options.nsfw ? card : !card.nsfw,
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCards).length < QUESTION_COUNT) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS);
    return {
      allCards: options.nsfw ? Object.values(allCards) : Object.values(allCards).filter((card) => !card.nsfw),
      allSuspects: Object.values(allSuspects),
    };
  }

  return {
    allCards: availableCards,
    allSuspects: utils.tdr.modifySuspectIdsByOptions(Object.values(allSuspects), options, true),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveData = async (pastQuestions: TestemunhaOcularEntry[]) => {
  const usedQuestionsIds: BooleanDictionary = {};
  const usedSuspectsIds: BooleanDictionary = {};
  const suspectAnswers: Dictionary<Dictionary<boolean>> = {};

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
