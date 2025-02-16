// Types
import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import type { ResourceData, TaNaCaraOptions } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { PLAYER_COUNTS, QUESTIONS_PER_PLAYER } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getResourceData = async (language: string, options: TaNaCaraOptions): Promise<ResourceData> => {
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
  const availableCards = Object.values(utils.game.filterOutByIds(allCards, usedCards)).filter((card) =>
    options.nsfw ? card : !card.nsfw,
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCards).length < QUESTIONS_PER_PLAYER * PLAYER_COUNTS.MAX) {
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
