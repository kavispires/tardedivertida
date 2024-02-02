// Types
import { TestimonyQuestionCard } from '../../types/tdr';
import type { ResourceData, TesteDeElencoOptions } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: string, options: TesteDeElencoOptions): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`;
  // Get full deck
  const allCards: Collection<TestimonyQuestionCard> = await resourceUtils.fetchResource(resourceName);
  // Get images info
  const allSuspects = await resourceUtils.fetchTDIData('us/info');

  // Filter out used cards
  const availableCards = Object.values(allCards).filter((card) => (options.nsfw ? card : !card.nsfw));

  return {
    allCards: availableCards,
    allActors: utils.imageCards.modifySuspectIdsByOptions(Object.values(allSuspects), options),
  };
};
