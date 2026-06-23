// Types
import type { MovieCardData, TestimonyQuestionCardData } from '../../types/tdr';
import type { ResourceData, TesteDeElencoOptions } from './types';
import { sampleSize } from 'lodash';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing testimony cards, actors, movies, and items
 */
export const getData = async (language: string, options: TesteDeElencoOptions): Promise<ResourceData> => {
  // Get full deck
  const allCards = await resourceUtils.fetchResource<Dictionary<TestimonyQuestionCardData>>(
    TDR_RESOURCES.TESTIMONY_QUESTIONS,
    language,
  );
  // Get images info
  const allActors = await utils.tdr.getSuspects({
    styleVariant: options.styleVariant,
    cleanup: true,
    decks: ['adult'],
  });

  // Filter out used cards
  const availableCards = Object.values(allCards).filter((card) => (options.nsfw ? card : !card.nsfw));

  // Get full movies deck
  const allMovies = await resourceUtils.fetchResource<Dictionary<MovieCardData>>(
    TDR_RESOURCES.MOVIES,
    language,
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
    allActors,
  };
};
