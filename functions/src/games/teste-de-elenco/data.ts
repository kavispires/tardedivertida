import { sampleSize } from 'lodash';
// Types
import type { MovieCardData, TestimonyStatementCardData } from '../../types/tdr';
import type { ResourceData, TesteDeElencoOptions } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
// Services
import { fetchResource } from '../../services/resource';
// Resources
import { getItems, getSuspects, itemUtils } from '../../mechanics/resources';

/**
 * Get question resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing testimony cards, actors, movies, and items
 */
export const getData = async (language: string, options: TesteDeElencoOptions): Promise<ResourceData> => {
  // Get full deck
  const allCards = await fetchResource<Dictionary<TestimonyStatementCardData>>(
    TDR_RESOURCES.TESTIMONY_STATEMENTS,
    language,
  );
  // Get images info
  const allActors = await getSuspects({
    styleVariant: options.styleVariant,
    cleanup: true,
    decks: ['adult'],
  });

  // Filter out used cards
  const availableCards = Object.values(allCards).filter((card) => (options.nsfw ? card : !card.nsfw));

  // Get full movies deck
  const allMovies = await fetchResource<Dictionary<MovieCardData>>(TDR_RESOURCES.MOVIES, language);

  const items = await getItems(6, {
    allowNSFW: !!options.nsfw,
    decks: ['alien', 'dream', 'manufactured'],
    filters: [(item) => !(item?.decks ?? []).includes('suspect')],
    cleanUp: itemUtils.cleanupDecks,
  });

  return {
    moviesSamples: sampleSize(allMovies, 6),
    itemsSamples: items,
    allCards: availableCards,
    allActors,
  };
};
