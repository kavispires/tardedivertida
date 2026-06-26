// Types
import type { TextCardData } from '../../types/tdr';
import type { PastBattles, ResourceData, SuperCampeonatoOptions } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { CHALLENGES_PER_GAME, CONTENDERS_PER_PLAYER, CONTENDERS_PER_ROUND } from './constants';
// Services
import {
  fetchGlobalTrackerDocumentData,
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
} from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Resources
import { getContenders } from '../../mechanics/resources';
// Utils
import { filterOutByIds } from '../../utils';

/**
 * Get challenges and contenders  based on the game's language
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @param options - Game options including NSFW setting and contender decks
 * @returns Resource data containing challenge cards and contender cards
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  options: SuperCampeonatoOptions,
): Promise<ResourceData> => {
  // Get full challenges deck
  const challengesResponse = await fetchResource<Dictionary<TextCardData>>(
    TDR_RESOURCES.CHALLENGES,
    language,
  );
  // Get used challenges deck
  const usedChallenges = await fetchGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.CHALLENGES, {});

  // Filter out used cards
  let availableChallenges = filterOutByIds(challengesResponse, usedChallenges);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableChallenges).length < CHALLENGES_PER_GAME) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.CHALLENGES);
    availableChallenges = challengesResponse;
  }

  // Get full contenders deck
  const contenders = await getContenders(
    language,
    !!options.nsfw,
    options.contenderDecks,
    Math.max(playerCount, CONTENDERS_PER_ROUND) * CONTENDERS_PER_PLAYER,
  );

  return {
    challenges: Object.values(availableChallenges),
    contenders,
  };
};

/**
 * Save used challenges and contenders to global documents
 * @param pastBattles - Array of past battles with challenges and contenders
 */
export const saveData = async (pastBattles: PastBattles) => {
  const challengeIds: Dictionary<boolean> = {};
  const contenderIds: Dictionary<boolean> = {};

  pastBattles.forEach((entry) => {
    challengeIds[entry.challenge.id] = true;
    entry.contenders.forEach((contender) => {
      contenderIds[contender.id] = true;
    });
  });

  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.CONTENDERS, contenderIds);
  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.CHALLENGES, challengeIds);
};
