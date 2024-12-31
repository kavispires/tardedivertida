// Types
import type { TestimonyQuestionCard } from '../../types/tdr';
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
  const resourceName = `${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`;
  // Get full deck
  const allCards: Collection<TestimonyQuestionCard> = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS, {});
  // Get images info
  const allSuspects = await resourceUtils.fetchResource(TDR_RESOURCES.SUSPECTS);

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
    allSuspects: utils.imageCards.modifySuspectIdsByOptions(Object.values(allSuspects), options),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveData = async (pastQuestions: TestemunhaOcularEntry[]) => {
  const usedQuestionsIds: BooleanDictionary = {};
  const usedSuspectsIds: BooleanDictionary = {};
  const suspectAnswers: Collection<Collection<boolean>> = {};

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
