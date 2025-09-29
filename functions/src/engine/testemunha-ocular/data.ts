// Types
import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import type { ResourceData, TestemunhaOcularHistoryEntry, TestemunhaOcularOptions } from './types';
// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { QUESTION_COUNT } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';
import { set } from 'lodash';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getQuestionsAndSuspects = async (
  language: string,
  options: TestemunhaOcularOptions,
): Promise<ResourceData> => {
  const availableCards = await utils.tdr.getUnusedResources<TestimonyQuestionCard>(
    TDR_RESOURCES.TESTIMONY_QUESTIONS,
    GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS,
    language as Language,
    options.nsfw,
    QUESTION_COUNT,
  );

  const allSuspects = await resourceUtils.fetchResource<Dictionary<SuspectCard>>(TDR_RESOURCES.SUSPECTS);

  return {
    allCards: availableCards,
    allSuspects: utils.tdr.modifySuspectIdsByOptions(Object.values(allSuspects), options, true),
  };
};

/**
 * Save used questions to the global document
 * @param pastQuestions
 */
export const saveData = async (
  gameId: GameId,
  history: TestemunhaOcularHistoryEntry[],
  win: boolean,
  perpetratorId: CardId,
  playerCount: number,
) => {
  try {
    const usedQuestionsIds: BooleanDictionary = {};
    const usedSuspectsIds: BooleanDictionary = {};
    // If the players lost, skip saving perpetrator answers and first entry.
    const pastQuestions = win ? history : history.slice(1);

    // testimonyAnswers[questionId][suspectId] = [array of -1 or 1 for false/true answers]
    const testimonyAnswers: Record<CardId, Record<CardId, (-1 | 1)[]>> = {};

    pastQuestions.forEach((entry) => {
      usedQuestionsIds[entry.id] = true;

      // The strength of the answer is equal to the number of players divider by 2 rounded up times the number of eliminated suspects
      const strength = Math.ceil(playerCount / 2) * entry.eliminated.length;

      entry.eliminated.forEach((suspectId) => {
        usedSuspectsIds[suspectId] = true;
        set(testimonyAnswers, `${entry.id}.${suspectId}`, Array(strength).fill(entry.statement ? -1 : +1));
      });

      // If two suspects were eliminated, the remaining suspects, but the perpetrator, receive the opposite value
      if (entry.eliminated.length >= 2 && strength > 1) {
        entry.remaining.forEach((suspectId) => {
          if (suspectId !== perpetratorId) {
            set(testimonyAnswers, `${entry.id}.${suspectId}`, [entry.statement ? 1 : -1]);
          }
        });
      }

      if (win) {
        set(testimonyAnswers, `${entry.id}.${perpetratorId}`, Array(strength).fill(entry.statement ? 1 : -1));
      }
    });

    // Save used questions
    await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS, usedQuestionsIds);
    // Save used suspects
    await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.SUSPECTS, usedSuspectsIds);
    // Save Suspect Answers
    await dataUtils.updateDataFirebaseDoc(DATA_DOCUMENTS.SUSPECT_ANSWERS, {
      [gameId]: JSON.stringify(testimonyAnswers),
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.error('Error saving game data:', error);
  }
};
