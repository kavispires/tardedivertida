// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Type
import type { TextCard } from '../../types/tdr';
import type { PastBattles, ResourceData, SuperCampeonatoOptions } from './types';
// Helpers
import * as resourceUtils from '../resource';
import * as globalUtils from '../global';
import utils from '../../utils';
import { CHALLENGES_PER_GAME, CONTENDERS_PER_PLAYER, CONTENDERS_PER_ROUND } from './constants';

/**
 * Get challenges and contenders  based on the game's language
 * @param language
 * @param playerCount
 * @param allowNSFW
 * @returns
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  options: SuperCampeonatoOptions,
): Promise<ResourceData> => {
  // Get full challenges deck
  const challengesResponse = await resourceUtils.fetchResource<Dictionary<TextCard>>(
    TDR_RESOURCES.CHALLENGES,
    language,
  );
  // Get used challenges deck
  const usedChallenges = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.CHALLENGES, {});

  // Filter out used cards
  let availableChallenges = utils.game.filterOutByIds(challengesResponse, usedChallenges);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableChallenges).length < CHALLENGES_PER_GAME) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.CHALLENGES);
    availableChallenges = challengesResponse;
  }

  // Get full contenders deck
  const contenders = await utils.tdr.getContenders(
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

export const saveData = async (pastBattles: PastBattles) => {
  const challengeIds: BooleanDictionary = {};
  const contenderIds: BooleanDictionary = {};

  pastBattles.forEach((entry) => {
    challengeIds[entry.challenge.id] = true;
    entry.contenders.forEach((contender) => {
      contenderIds[contender.id] = true;
    });
  });

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.CONTENDERS, contenderIds);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.CHALLENGES, challengeIds);
};
