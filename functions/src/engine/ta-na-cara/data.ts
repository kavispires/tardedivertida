// Types
import type { ResourceData, TaNaCaraOptions } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { PLAYER_COUNTS, QUESTIONS_PER_PLAYER } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import { modifySuspectIdsByOptions } from './helpers';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getResourceData = async (language: string, options: TaNaCaraOptions): Promise<ResourceData> => {
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
  if (Object.keys(availableCards).length < QUESTIONS_PER_PLAYER * PLAYER_COUNTS.MAX) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS);
    return {
      allCards,
      allSuspects: Object.values(allSuspects),
    };
  }

  return {
    allCards: Object.values(availableCards),
    allSuspects: modifySuspectIdsByOptions(Object.values(allSuspects), options),
  };
};
