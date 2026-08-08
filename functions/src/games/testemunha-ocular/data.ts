import { set } from 'lodash';
// Types
import type { CrimeReasonData, TestimonyStatementCardData } from '../../types/tdr';
import type { ResourceData, TestemunhaOcularHistoryEntry, TestemunhaOcularOptions } from './types';
// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { QUESTION_COUNT } from './constants';
// Services
import { updateFirestoreCommunityData } from '../../services/community-data';
import { updateGlobalTrackerDocumentData } from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Resources
import { getSuspects, getUnusedResources } from '../../mechanics/resources';

/**
 * Get data resources based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing testimony statements, suspects, and crime reasons
 */
export const getQuestionsAndSuspects = async (
  language: string,
  options: TestemunhaOcularOptions,
): Promise<ResourceData> => {
  const availableCards = await getUnusedResources<TestimonyStatementCardData>(
    TDR_RESOURCES.TESTIMONY_STATEMENTS,
    GLOBAL_USED_DOCUMENTS.TESTIMONY_STATEMENTS,
    language as Language,
    options.nsfw,
    QUESTION_COUNT,
  );

  const allSuspects = await getSuspects({
    styleVariant: options.styleVariant,
    onlyGbExclusive: options.gbExclusive,
    cleanup: true,
    decks: ['adult'],
  });

  const crimeReasons = await fetchResource<Dictionary<CrimeReasonData>>(TDR_RESOURCES.CRIME_REASONS);

  return {
    allCards: availableCards,
    allSuspects,
    allReasons: crimeReasons,
  };
};

/**
 * Save used questions to the global document
 * @param gameId - Unique game identifier
 * @param history - Array of testimony history entries
 * @param win - Whether players won the game
 * @param perpetratorId - ID of the perpetrator suspect
 * @param playerCount - Number of players in the game
 */
export const saveData = async (
  gameId: UID,
  history: TestemunhaOcularHistoryEntry[],
  win: boolean,
  perpetratorId: UID,
  playerCount: number,
) => {
  try {
    const usedQuestionsIds: Dictionary<boolean> = {};
    const usedSuspectsIds: Dictionary<boolean> = {};
    // If the players lost, skip saving perpetrator answers and first entry.
    const pastQuestions = win ? history : history.slice(1);

    // testimonyAnswers[questionId][suspectId] = [array of -1 or 1 for false/true answers]
    const testimonyAnswers: Record<UID, Record<UID, (-1 | 1)[]>> = {};

    pastQuestions.forEach((entry) => {
      usedQuestionsIds[entry.id] = true;

      // The strength of the answer is equal to the number of players divider by 2 rounded up times the number of eliminated suspects
      const strength = Math.ceil(playerCount / 2) * entry.eliminated.length;

      entry.eliminated.forEach((suspectId) => {
        usedSuspectsIds[suspectId] = true;
        set(testimonyAnswers, `${entry.id}.${suspectId}`, Array(strength).fill(entry.testimony ? -1 : +1));
      });

      // If two suspects were eliminated, the remaining suspects, but the perpetrator, receive the opposite value
      if (entry.eliminated.length >= 2 && strength > 1) {
        entry.remaining.forEach((suspectId) => {
          if (suspectId !== perpetratorId) {
            set(testimonyAnswers, `${entry.id}.${suspectId}`, [entry.testimony ? 1 : -1]);
          }
        });
      }

      if (win) {
        set(testimonyAnswers, `${entry.id}.${perpetratorId}`, Array(strength).fill(entry.testimony ? 1 : -1));
      }
    });

    // Save used questions
    await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.TESTIMONY_STATEMENTS, usedQuestionsIds);
    // Save used suspects
    await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.SUSPECTS, usedSuspectsIds);
    // Save Suspect Answers
    await updateFirestoreCommunityData(DATA_DOCUMENTS.SUSPECT_ANSWERS, {
      [gameId]: JSON.stringify(testimonyAnswers),
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.error('Error saving game data:', error);
  }
};
