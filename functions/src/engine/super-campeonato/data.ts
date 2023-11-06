// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Type
import { PastBattles, ResourceData } from './types';
// Helpers
import * as resourceUtils from '../resource';
import * as globalUtils from '../global';
import utils from '../../utils';
import { CHALLENGES_PER_GAME, CONTENDERS_PER_PLAYER } from './constants';

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
  allowNSFW: boolean
): Promise<ResourceData> => {
  const challengesResourceName = `${TDR_RESOURCES.CHALLENGES}-${language}`;
  // Get full challenges deck
  const challengesResponse: Collection<TextCard> = await resourceUtils.fetchResource(challengesResourceName);
  // Get used challenges deck
  const usedChallenges = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.CHALLENGES, {});

  // Filter out used cards
  let availableChallenges: Record<string, TextCard> = utils.game.filterOutByIds(
    challengesResponse,
    usedChallenges
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableChallenges).length < CHALLENGES_PER_GAME) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.CHALLENGES);
    availableChallenges = challengesResponse;
  }

  // Get full contenders deck
  const contenders = await utils.tdr.getContenders(language, allowNSFW, playerCount * CONTENDERS_PER_PLAYER);

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
