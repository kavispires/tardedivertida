// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from './constants';
// Helpers
import * as firebaseUtils from './firebase';
import * as gameUtils from './game-utils';
import { getGlobalFirebaseDocData, updateGlobalFirebaseDoc } from '../engine/global';
import { fetchResource } from '../engine/resource';
import { buildIdDictionary } from './helpers';
import utils from '.';
import { every, some } from 'lodash';

/**
 * Get alien items for given quantity and NSFW allowance otherwise it resets the used items and use all available
 * @param quantity
 * @param allowNSFW - indicates that NSFW items are allowed
 * @param categories - list of categories that items must be within
 * @param filters - list of filter functions to filter out items
 * @param balanceAttributes - indicates that item must have balanced attributes (for alien bot for example)
 * @returns
 */
export const getAlienItems = async (
  quantity: number,
  options: {
    allowNSFW: boolean;
    categories?: string[];
    filters?: ((item: AlienItem) => boolean)[];
    balanceAttributes?: boolean;
  } = {
    allowNSFW: false,
    categories: [],
    filters: [],
    balanceAttributes: false,
  }
): Promise<AlienItem[]> => {
  const allAlienItemsObj: Collection<AlienItem> = await fetchResource(TDR_RESOURCES.ALIEN_ITEMS);

  function getWellWeightedItems(items: Collection<AlienItem>) {
    const attributeKeysWith5: Set<string> = new Set();
    const selectedItems: AlienItem[] = [];
    const leftOverItems: AlienItem[] = [];
    const shuffledItems = gameUtils.shuffle(Object.values(items));

    for (const item of shuffledItems) {
      const attributeKeyWith5 = gameUtils
        .shuffle(Object.keys(item.attributes))
        .find((key) => item.attributes[key] === 5);

      if (attributeKeyWith5 && !attributeKeysWith5.has(attributeKeyWith5)) {
        selectedItems.push(item);
        attributeKeysWith5.add(attributeKeyWith5);
      } else {
        leftOverItems.push(item);
      }

      if (selectedItems.length === quantity) {
        break;
      }
    }

    if (selectedItems.length < quantity) {
      return selectedItems.concat(leftOverItems.slice(0, quantity - selectedItems.length));
    }

    return selectedItems;
  }

  // Filter out items that don't match the options
  Object.values(allAlienItemsObj).forEach((item) => {
    // Handle NSFW
    if (!options.allowNSFW && item.nsfw) {
      delete allAlienItemsObj[item.id];
      return;
    }

    // Handle categories
    if (options.categories && options.categories.length) {
      if (!alienItemUtils.onlyItemsWithinCategories(options?.categories ?? [])(item)) {
        delete allAlienItemsObj[item.id];
        return;
      }
    }

    // If filter is provided, filter out items that don't match the filter
    if (options.filters) {
      if (!every(options.filters, (filter) => filter(item))) {
        delete allAlienItemsObj[item.id];
        return;
      }
    }
  });

  // Get used items deck
  const usedItems: BooleanDictionary = await getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS, {});

  // Filter out used items
  let availableAlienItems = gameUtils.filterOutByIds(allAlienItemsObj, usedItems);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableAlienItems).length < quantity) {
    await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);
    availableAlienItems = allAlienItemsObj;
  }

  let list = Object.values(availableAlienItems);

  // If there are enough safe items, return them
  if (list.length >= quantity) {
    return options.balanceAttributes
      ? getWellWeightedItems(utils.helpers.buildDictionaryFromList(list))
      : gameUtils.getRandomItems(list, quantity);
  }

  // If not the minimum items needed, reset and use all safe
  await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);

  list = Object.values(allAlienItemsObj);
  return options.balanceAttributes
    ? getWellWeightedItems(utils.helpers.buildDictionaryFromList(list))
    : gameUtils.getRandomItems(list, quantity);
};

export const alienItemUtils = {
  /**
   * Filter alien only if safe for work
   */
  onlySafeForWork: (item: AlienItem) => !item.nsfw,
  /**
   * Filter alien items by category/tag
   * @param category
   * @returns boolean
   */
  onlyItemsWithinCategories: (categories: string[]) => (item: AlienItem) => {
    return every(categories, (category) => (item.categories ?? []).includes(category));
  },
  /**
   * Filter alien items by category/tag
   */
  notWithinCategories: (categories: string[]) => (item: AlienItem) => {
    return !some(categories, (category) => (item.categories ?? []).includes(category));
  },
  onlyWithName: (language: Language) => (item: AlienItem) => Boolean(item.name[language].trim()),
  /**
   * Filter item only if it has at least 75% of attribute data
   * @param item
   * @returns
   */
  onlyWithAttributes: (item: AlienItem) => {
    const totalAttributes = Object.keys(item.attributes).length;

    let attributesWithWeights = 0;
    Object.values(item.attributes).forEach((attribute) => {
      if (attribute !== 0) {
        attributesWithWeights++;
      }
    });

    if (totalAttributes * 0.75 > attributesWithWeights) {
      return false;
    }
    return true;
  },
};

/**
 * Saves list of used alien items ids into the global used document
 * @param items
 * @returns
 */
export const saveUsedAlienItems = async (items: AlienItem[]) => {
  const itemsIdsDict = buildIdDictionary(items);
  return updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS, itemsIdsDict);
};

/**
 * Get single words for given quantity or all of them
 * @param language
 * @param quantity
 * @returns
 */
export const getSingleWords = async (language: Language, quantity?: number): Promise<TextCard[]> => {
  const resourceName = `${TDR_RESOURCES.SINGLE_WORDS}-${language}`;
  // Get full deck
  const allWords: Collection<TextCard> = await fetchResource(resourceName);

  if (!quantity) {
    return Object.values(allWords);
  }

  // Get used WORDS deck
  const usedWords: BooleanDictionary = await getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.SINGLE_WORDS, {});

  // Filter out used WORDS
  let availableWords = gameUtils.filterOutByIds(allWords, usedWords);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableWords).length < quantity) {
    await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.SINGLE_WORDS);
    availableWords = allWords;
  }

  return gameUtils.getRandomItems(Object.values(availableWords), quantity);
};

/**
 * Saves list of used single words ids into the global used document
 * @param usedWords
 * @returns
 */
export const saveUsedSingleWords = async (usedWords: BooleanDictionary) => {
  return updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.SINGLE_WORDS, usedWords);
};

/**
 * Get contenders
 * @param language
 * @param allowNSFW
 * @param quantity
 * @returns
 */
export const getContenders = async (
  language: Language,
  allowNSFW?: boolean,
  quantity?: number
): Promise<ContenderCard[]> => {
  const contendersResponse: Collection<ContenderCard> = await fetchResource(TDR_RESOURCES.CONTENDERS);

  // Get only contenders that match the language selected
  const languageContenders = Object.values(contendersResponse)
    .filter((c) => (c.exclusivity ? c.exclusivity === language : true))
    .reduce((acc: Collection<ContenderCard>, entry) => {
      acc[entry.id] = entry;
      return acc;
    }, {});

  if (!quantity) {
    if (allowNSFW) {
      return Object.values(languageContenders);
    }

    return Object.values(languageContenders).filter((c) => !c.nsfw);
  }

  // Get used items deck
  const usedContenders: BooleanDictionary = await getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.CONTENDERS,
    {}
  );

  // Filter out used items
  let availableContenders = gameUtils.filterOutByIds(languageContenders, usedContenders);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableContenders).length < quantity) {
    await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.CONTENDERS);
    availableContenders = languageContenders;
  }

  if (allowNSFW) {
    return gameUtils.getRandomItems(Object.values(availableContenders), quantity);
  }

  const safeContenders = Object.values(availableContenders).filter((c) => !c.nsfw);

  // If there are enough safe items, return them
  if (safeContenders.length >= quantity) {
    return gameUtils.getRandomItems(safeContenders, quantity);
  }

  // If not the minimum items needed, reset and use all safe
  await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.CONTENDERS);
  const allSafeContenders = Object.values(languageContenders).filter((c) => !c.nsfw);
  return gameUtils.getRandomItems(Object.values(allSafeContenders), quantity);
};

/**
 * Get adjectives for given quantity or all of them
 * @param language
 * @param quantity
 * @returns
 */
export const getAdjectives = async (language: Language, quantity?: number): Promise<TextCard[]> => {
  const resourceName = `${TDR_RESOURCES.ADJECTIVES}-${language}`;
  // Get full deck
  const allAdjectives: Collection<TextCard> = await fetchResource(resourceName);

  if (!quantity) {
    return gameUtils.shuffle(Object.values(allAdjectives));
  }

  // Get used WORDS deck
  const usedAdjectives: BooleanDictionary = await getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.ADJECTIVES,
    {}
  );

  // Filter out used WORDS
  let availableAdjectives = gameUtils.filterOutByIds(allAdjectives, usedAdjectives);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableAdjectives).length < quantity) {
    await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ADJECTIVES);
    availableAdjectives = allAdjectives;
  }

  return gameUtils.getRandomItems(Object.values(availableAdjectives), quantity);
};

/**
 * Saves list of used adjectives ids into the global used document
 * @param usedAdjectives
 * @returns
 */
export const saveUsedAdjectives = async (usedAdjectives: BooleanDictionary) => {
  return updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.ADJECTIVES, usedAdjectives);
};
