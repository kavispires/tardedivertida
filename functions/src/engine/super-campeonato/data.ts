// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Type
import { PastBattles, ResourceData } from './types';
// Helpers
import * as resourceUtils from '../resource';
import * as globalUtils from '../global';
import utils from '../../utils';
import { CHALLENGES_PER_GAME } from './constants';

/**
 * Get challenges and contenders  based on the game's language
 * @param language
 * @param isAlternativeDecks
 * @returns
 */
export const getResourceData = async (
  language: string,
  isAlternativeDecks: boolean
): Promise<ResourceData> => {
  const challengesResourceName = `${TDR_RESOURCES.CHALLENGES}${isAlternativeDecks ? '-2' : ''}-${language}`;
  // Get full challenges deck
  const challengesResponse = await resourceUtils.fetchResource(challengesResourceName);
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
  const contendersResponse: Record<CardId, ContenderCard> = await resourceUtils.fetchResource(
    isAlternativeDecks ? `${TDR_RESOURCES.CONTENDERS}-2` : TDR_RESOURCES.CONTENDERS
  );
  // Get used challenges deck
  const usedContenders = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.CONTENDERS, {});

  // Get only contenders that match the language selected
  const languageContenders = Object.values(contendersResponse)
    .filter((c) => !c.exclusivity || c.exclusivity === language)
    .reduce((acc: Record<CardId, ContenderCard>, entry) => {
      acc[entry.id] = entry;
      return acc;
    }, {});

  // Filter out used cards
  let availableContenders: Record<string, ContenderCard> = utils.game.filterOutByIds(
    languageContenders,
    usedContenders
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableContenders).length < CHALLENGES_PER_GAME) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.CONTENDERS);
    availableContenders = languageContenders;
  }

  return {
    challenges: Object.values(availableChallenges),
    contenders: Object.values(availableContenders),
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
