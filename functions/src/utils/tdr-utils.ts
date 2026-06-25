import { every, orderBy, sample, sampleSize, shuffle, some } from 'lodash';
// Types
import type { ContenderCardData, ItemData, SuspectCardData, TextCardData } from '../types/tdr';
// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from './constants';
// Services
import { updateFirestoreCommunityData } from '../services/community-data';
import {
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
  fetchGlobalTrackerDocumentData,
} from '../services/global-tracker';
import { fetchResource } from '../services/resource';
// Internal
import * as gameUtils from './game-utils';
import { buildBooleanDictionary } from './helpers';

/**
 * Retrieves items with optional filtering and NSFW handling
 * @param quantity - The number of items to return, or all if undefined
 * @param options - Configuration options for filtering items
 * @param options.allowNSFW - Whether to include NSFW items
 * @param options.decks - Array of deck names to filter by
 * @param options.deckFiltering - Whether to filter by 'OR' or 'AND' logic for decks
 * @param options.filters - Array of filter functions to apply to items
 * @param options.cleanUp - Optional function to clean up item objects before returning
 */
export const getItems = async (
  quantity?: number,
  options: {
    allowNSFW: boolean;
    decks?: string[];
    deckFiltering?: 'OR' | 'AND';
    filters?: ((item: ItemData) => boolean)[];
    cleanUp?: (item: ItemData) => ItemData;
  } = {
    allowNSFW: false,
    deckFiltering: 'OR',
    decks: [],
    filters: [],
  },
): Promise<ItemData[]> => {
  const itemsObj: Dictionary<ItemData> = await fetchResource(TDR_RESOURCES.ITEMS);

  // Filter out items that don't match the options
  Object.values(itemsObj).forEach((item) => {
    // Handle NSFW
    if (!options.allowNSFW && item.nsfw) {
      delete itemsObj[item.id];
      return;
    }

    // Handle decks
    if (options.decks?.length) {
      const selectorFunction =
        options.deckFiltering === 'AND'
          ? itemUtils.onlyItemsWithinDecks
          : itemUtils.onlyItemsWithinEitherDecks;

      if (!selectorFunction(options?.decks ?? [])(item)) {
        delete itemsObj[item.id];
        return;
      }
    }

    // If filter is provided, filter out items that don't match the filter
    if (options.filters) {
      if (!every(options.filters, (filter) => filter(item))) {
        delete itemsObj[item.id];
        return;
      }
    }
  });

  // If no quantity is provided, return all items that match the options
  if (!quantity) {
    if (!options.cleanUp) {
      return Object.values(itemsObj);
    }
    // If cleanUp function is provided, apply it to each item
    return Object.values(itemsObj).map(options.cleanUp);
  }

  // Get used items deck
  const usedItems: Dictionary<boolean> = await fetchGlobalTrackerDocumentData(
    GLOBAL_USED_DOCUMENTS.ITEMS,
    {},
  );

  // Filter out used items
  let availableAlienItems = gameUtils.filterOutByIds(itemsObj, usedItems);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableAlienItems).length < quantity) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);
    availableAlienItems = itemsObj;
  }

  let list = Object.values(availableAlienItems);

  // If there are enough safe items, return them
  if (list.length >= quantity) {
    return sampleSize(list, quantity).map(options.cleanUp ?? ((item) => item));
  }

  // If not the minimum items needed, reset and use all safe
  await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);

  list = Object.values(itemsObj);
  return sampleSize(list, quantity).map(options.cleanUp ?? ((item) => item));
};

/**
 * Utility functions for filtering and manipulating ItemData objects
 */
export const itemUtils = {
  /**
   * Filter alien only if safe for work
   */
  onlySafeForWork: (item: ItemData) => !item.nsfw,
  /**
   * Get alien items that are within all of the given decks (intersection)
   */
  onlyItemsWithinDecks: (decks: string[]) => (item: ItemData) => {
    return every(decks, (deck) => (item.decks ?? []).includes(deck));
  },
  /**
   * Get alien items that are within any of the given decks (union)
   */
  onlyItemsWithinEitherDecks: (decks: string[]) => (item: ItemData) => {
    return some(decks, (deck) => (item.decks ?? []).includes(deck));
  },
  /**
   * Filter alien items by deck
   */
  notWithinDecks: (decks: string[]) => (item: ItemData) => {
    return !some(decks, (deck) => (item.decks ?? []).includes(deck));
  },
  /**
   * Filter item only if it has a name in the given language
   */
  onlyWithName: (language: Language) => (item: ItemData) => Boolean(item.name[language].trim()),
  /**
   * Removes the prop decks from the item
   */
  cleanupDecks: (item: ItemData): ItemData => {
    delete item.decks;
    return item;
  },
};

/**
 * Saves list of used items ids into the global used document
 * @param items
 * @returns
 */
export const saveUsedItems = async (items: ItemData[]) => {
  const itemsIdsDict = buildBooleanDictionary(items);
  return updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.ITEMS, itemsIdsDict);
};

/**
 * Saves list of used alien items ids into the global used document
 * @param items
 * @returns
 */
export const saveUsedAlienItems = async (items: ItemData[]) => {
  const itemsIdsDict = buildBooleanDictionary(items);
  return updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS, itemsIdsDict);
};

/**
 * Get single words for given quantity or all of them
 * @param language The language to fetch words for
 * @param quantity Number of words to return, or all if undefined
 * @returns Array of text cards
 */
export const getSingleWords = async (language: Language, quantity?: number): Promise<TextCardData[]> => {
  return getUnusedResources<TextCardData>(
    TDR_RESOURCES.SINGLE_WORDS,
    GLOBAL_USED_DOCUMENTS.SINGLE_WORDS,
    language,
    true,
    quantity,
  );
};

/**
 * Saves list of used single words ids into the global used document
 * @param usedWords
 * @returns
 */
export const saveUsedSingleWords = async (usedWords: Dictionary<boolean>) => {
  return updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.SINGLE_WORDS, usedWords);
};

/**
 * Retrieves contender cards with language and deck filtering
 * @param language - The language to fetch contenders for
 * @param allowNSFW - Whether to include NSFW contenders
 * @param decks - Array of deck names to filter by
 * @param quantity - The number of contenders to return, or all if undefined
 */
export const getContenders = async (
  language: Language,
  allowNSFW: boolean,
  decks: string[],
  quantity?: number,
): Promise<ContenderCardData[]> => {
  const contendersResponse: Dictionary<ContenderCardData> = await fetchResource(TDR_RESOURCES.CONTENDERS);

  const priorityDecks: Dictionary<ContenderCardData> = {};
  const includeSpecialDecks = decks.includes('special-td') || decks.includes('special-td-bg');

  // Get only contenders that match the language selected
  const languageContenders = Object.values(contendersResponse)
    .filter((c) => (c.exclusivity ? c.exclusivity === language : true && allowNSFW ? true : !c.nsfw))
    .reduce((acc: Dictionary<ContenderCardData>, entry) => {
      // Special Decks are held in a separate object
      if (
        includeSpecialDecks &&
        (entry.decks?.includes('special-td') || entry.decks?.includes('special-td-bg'))
      ) {
        priorityDecks[entry.id] = entry;
        return acc;
      }

      // All decks
      if (decks.includes('any')) {
        acc[entry.id] = entry;
        return acc;
      }

      // Always include the base deck
      if (entry.decks?.includes('base')) {
        acc[entry.id] = entry;
        return acc;
      }

      // Specific decks
      if (entry.decks?.some((deck) => decks.includes(deck))) {
        acc[entry.id] = entry;
      }
      return acc;
    }, {});

  if (!quantity) {
    return [...Object.values(priorityDecks), ...Object.values(languageContenders)];
  }

  // Get used items deck
  const usedContenders: Dictionary<boolean> = await fetchGlobalTrackerDocumentData(
    GLOBAL_USED_DOCUMENTS.CONTENDERS,
    {},
  );

  const cardQuantity = quantity + 5;

  // Filter out used items
  let availableContendersDict = gameUtils.filterOutByIds(languageContenders, usedContenders);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableContendersDict).length < cardQuantity) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.CONTENDERS);
    availableContendersDict = languageContenders;
  }

  let availableContenders = Object.values(availableContendersDict);

  // If not the minimum items needed, reset and use all safe
  if (availableContenders.length < cardQuantity) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.CONTENDERS);
    availableContenders = Object.values(languageContenders);
  }

  const selectedContenders = sampleSize(availableContenders, cardQuantity);
  const withPrioritized = [...Object.values(priorityDecks), ...selectedContenders];

  return sampleSize(withPrioritized, quantity);
};

/**
 * Get adjectives for given quantity or all of them
 * @param language The language to fetch adjectives for
 * @param quantity Number of adjectives to return, or all if undefined
 * @returns Array of adjective cards
 */
export const getAdjectives = async (language: Language, quantity?: number): Promise<TextCardData[]> => {
  return getUnusedResources<TextCardData>(
    TDR_RESOURCES.ADJECTIVES,
    GLOBAL_USED_DOCUMENTS.ADJECTIVES,
    language,
    true,
    quantity,
  );
};

/**
 * Generic function to get resources with NSFW filtering and used tracking
 * @param resourceKey The key in TDR_RESOURCES to fetch
 * @param usedDocKey The key in GLOBAL_USED_DOCUMENTS to track used resources
 * @param language The language to fetch resources for
 * @param allowNSFW Whether to include NSFW content
 * @param quantity Number of resources to return, or all if undefined
 * @returns Array of resources
 */
export const getUnusedResources = async <T extends { id: string; nsfw?: boolean }>(
  resourceKey: ValueOf<typeof TDR_RESOURCES>,
  usedDocKey: ValueOf<typeof GLOBAL_USED_DOCUMENTS>,
  language?: Language,
  allowNSFW = false,
  quantity?: number,
): Promise<T[]> => {
  // Get full deck
  const allResources: Dictionary<T> = await fetchResource(resourceKey, language);

  // Filter out NSFW resources if not allowed
  const safeResources = Object.values(allResources).reduce((acc: Dictionary<T>, resource) => {
    if (allowNSFW || !resource.nsfw) {
      acc[resource.id] = resource;
    }
    return acc;
  }, {});

  if (!quantity) {
    return shuffle(Object.values(safeResources));
  }

  // Get used resources
  const usedResources: Dictionary<boolean> = await fetchGlobalTrackerDocumentData(usedDocKey, {});

  // Filter out used resources
  let availableResources = gameUtils.filterOutByIds(safeResources, usedResources);

  // If not the minimum resources needed, reset and use all
  if (Object.keys(availableResources).length < quantity) {
    await resetGlobalTrackerDocument(usedDocKey);
    availableResources = safeResources;
  }

  return sampleSize(Object.values(availableResources), quantity);
};

/**
 * Retrieves suspect cards with style variant, deck filtering, and cleanup options
 * @param styleVariant - Style variant for suspect cards (gb, px, rl, fx), defaults to 'gb'
 * @param decks - Array of deck names to filter suspects by, defaults to ['adult']
 * @param quantity - Number of suspect cards to return, or all if undefined
 * @param cleanup - If true, returns only essential properties with modified IDs
 * @param randomStyleVariant - If true, randomly selects style variant for each suspect
 * @param onlyGbExclusive - If true, returns only suspects exclusive to GB style
 * @returns Array of suspect cards matching the specified criteria
 */
export const getSuspects = async ({
  styleVariant = 'gb',
  decks = ['adult'],
  quantity,
  cleanup = false,
  randomStyleVariant = false,
  onlyGbExclusive = false,
  sortBy,
}: {
  /**
   * Optional style variant for suspect cards, which determines the images used. If not provided, defaults to 'gb' (Ghibli style).
   */
  styleVariant?: SuspectCardsOptions['styleVariant'];
  /**
   * Optional array of deck names to filter suspects by. If not provided, only adults will be returned. If 'any' is included, suspects from all decks will be returned.
   */
  decks?: string[];
  /**
   * Number of suspect cards to return. If not provided, returns all suspects that match the style variant.
   */
  quantity?: number;
  /**
   * If true, only essential properties of suspects will be included in the result, and IDs will be modified to follow the format `us-[deckType]-[originalId]`. Defaults to false.
   */
  cleanup?: boolean;
  /**
   * If true, the style variant will be randomly selected for each suspect card, instead of using the provided styleVariant for all cards. Defaults to false.
   */
  randomStyleVariant?: boolean;
  /**
   * If true, only suspects that are exclusive to the GB style will be included, regardless of the provided styleVariant. Defaults to false.
   */
  onlyGbExclusive?: boolean;
  /**
   * Sorts the resulting suspects by the specified property. Usually name.pt or name.en, default is by id.
   */
  sortBy?: string;
}): Promise<SuspectCardData[]> => {
  const allSuspects = await fetchResource<Dictionary<SuspectCardData>>(TDR_RESOURCES.SUSPECTS);
  const suspectsArray = Object.values(allSuspects);

  function applyStyleVariantOnId(id: string, styleVariant: SuspectCardsOptions['styleVariant']): string {
    return `us-${styleVariant ?? 'gb'}-${id.split('-')[1]}`;
  }

  function cleanUpSuspect(suspect: SuspectCardData): SuspectCardData {
    return {
      id: suspect.id,
      name: suspect.name,
      gender: suspect.gender,
      age: suspect.age,
      race: suspect.race,
      build: suspect.build,
      height: suspect.height,
      features: [],
      deck: suspect.deck,
    };
  }

  function filterByDecks(list: SuspectCardData[]) {
    return list.filter((suspect) => {
      if (decks?.includes('any')) {
        return true;
      }

      if (decks?.includes(suspect.deck)) {
        return true;
      }
      return false;
    });
  }

  // Filter by decks
  let pool = filterByDecks(suspectsArray);

  if (onlyGbExclusive) {
    const gbExclusivePool = pool.filter((suspect) => suspect.gbExclusive);
    if (quantity && quantity > gbExclusivePool.length) {
      throw new Error(
        `Not enough suspects that are exclusive to GB style. Requested: ${quantity}, Available: ${gbExclusivePool.length}`,
      );
    }

    pool = gbExclusivePool;
  }

  const selectedStyleVariant = onlyGbExclusive
    ? 'gb'
    : styleVariant || (randomStyleVariant ? sample(['gb', 'px', 'rl', 'fx']) : 'gb');

  if (quantity) {
    pool = sampleSize(pool, quantity);
  }

  if (cleanup) {
    return orderBy(
      pool.map((suspect) => {
        return {
          ...cleanUpSuspect(suspect),
          id: applyStyleVariantOnId(suspect.id, selectedStyleVariant),
        };
      }),
      [sortBy || ((o) => Number(o.id.split('-')[2]))],
      ['asc', 'asc'],
    );
  }

  return pool.map((suspect) => ({
    ...suspect,
    id: applyStyleVariantOnId(suspect.id, selectedStyleVariant),
  }));
};

// /**
//  * Modifies the IDs of suspect cards based on the given options.
//  *
//  * @param suspects - An array of suspect cards to modify
//  * @param options - Optional configuration options for suspect cards
//  * @param cleanup - If true, only essential properties of suspects will be included in the result
//  * @returns An array of suspect cards with modified IDs
//  *
//  * The function transforms suspect IDs to follow the format `us-[deckType]-[originalId]`, where:
//  * - `us` is a fixed prefix
//  * - `deckType` is a two-letter code (gb: ghibli, px: pixar, rl: realistic, fx: fox)
//  * - `originalId` is the original ID number extracted from the suspect's ID
//  *
//  * When cleanup is true, only the following properties are included in each suspect:
//  * name, gender, age, race, build, height, and an empty features array.
//  */
// export const modifySuspectIdsByOptions = (
//   suspects: SuspectCardData[],
//   options?: SuspectCardsOptions,
//   cleanup?: boolean,
// ): SuspectCardData[] => {
//   const deckType =
//     {
//       ghibli: 'gb',
//       pixar: 'px',
//       realistic: 'rl',
//       fox: 'fx',
//     }[options?.styleVariant ?? 'ghibli'] ?? 'gb';

//   return suspects.map((suspect) => {
//     const hasOtherStyles = !suspect.gbExclusive;
//     const newId = '';

//     if (cleanup) {
//       return {
//         id: newId,
//         name: suspect.name,
//         gender: suspect.gender,
//         age: suspect.age,
//         race: suspect.race,
//         build: suspect.build,
//         height: suspect.height,
//         features: [],
//         deck: suspect.deck,
//       };
//     }

//     return {
//       ...suspect,
//       id: newId,
//     };
//   });
// };

/**
 * Saves list of used adjectives ids into the global used document
 * @param usedAdjectives - Dictionary of used adjectives ids
 * @returns Promise that resolves when the update is complete
 */
export const saveUsedAdjectives = async (usedAdjectives: Dictionary<boolean>) => {
  return updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.ADJECTIVES, usedAdjectives);
};

/**
 * Saves list of used items ids into the global used document
 * @param items- Array of items to save as used
 * @returns Promise that resolves when the update is complete
 */
export const savePairs = async (pairs: Dictionary<boolean>) => {
  return updateFirestoreCommunityData(DATA_DOCUMENTS.PAIRS, pairs);
};
