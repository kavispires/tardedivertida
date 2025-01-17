// Types
import type { SuspectCard, MovieCard, TestimonyQuestionCard } from '../../types/tdr';
import type { ResourceData, TesteDeElencoOptions } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';
import { sampleSize } from 'lodash';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: string, options: TesteDeElencoOptions): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.TESTIMONY_QUESTIONS}-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource<Dictionary<TestimonyQuestionCard>>(resourceName);
  // Get images info
  const allSuspects = await resourceUtils.fetchResource<Dictionary<SuspectCard>>(TDR_RESOURCES.SUSPECTS);

  // Filter out used cards
  const availableCards = Object.values(allCards).filter((card) => (options.nsfw ? card : !card.nsfw));

  // Get full movies deck
  const allMovies = await resourceUtils.fetchResource<Dictionary<MovieCard>>(
    `${TDR_RESOURCES.MOVIES}-${language}`,
  );

  const items = await utils.tdr.getItems(6, {
    allowNSFW: !!options.nsfw,
    decks: ['alien', 'dream', 'manufactured'],
    filters: [(item) => !(item?.decks ?? []).includes('suspect')],
    cleanUp: utils.tdr.itemUtils.cleanupDecks,
  });

  return {
    moviesSamples: sampleSize(allMovies, 6),
    itemsSamples: items,
    allCards: availableCards,
    allActors: utils.imageCards.modifySuspectIdsByOptions(Object.values(allSuspects), options),
  };
};
