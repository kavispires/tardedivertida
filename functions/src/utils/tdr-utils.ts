// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from './constants';
// Helpers
import * as firebaseUtils from './firebase';
import * as gameUtils from './game-utils';
import { getGlobalFirebaseDocData, updateGlobalFirebaseDoc } from '../engine/global';
import { fetchResource } from '../engine/resource';
import { buildIdDictionary } from './helpers';

/**
 * Get alien items for given quantity and NSFW allowance otherwise it resets the used items and use all available
 * @param quantity
 * @param allowNSFW
 * @returns
 */
export const getAlienItems = async (quantity: number, allowNSFW: boolean): Promise<AlienItem[]> => {
  const allAlienItemsObj: Collection<AlienItem> = await fetchResource(TDR_RESOURCES.ALIEN_ITEMS);

  // Get used items deck
  const usedItems: BooleanDictionary = await getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS, {});

  // Filter out used items
  let availableAlienItems = gameUtils.filterOutByIds(allAlienItemsObj, usedItems);

  // If not the minimum items needed, reset and use all
  if (Object.keys(availableAlienItems).length < quantity) {
    await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);
    availableAlienItems = allAlienItemsObj;
  }

  // If NSFW is allowed, just return the random items
  if (allowNSFW) {
    return gameUtils.getRandomItems(Object.values(availableAlienItems), quantity);
  }

  const safeItems = Object.values(availableAlienItems).filter((item) => !item.nsfw);

  // If there are enough safe items, return them
  if (safeItems.length >= quantity) {
    return gameUtils.getRandomItems(safeItems, quantity);
  }

  // If not the minimum items needed, reset and use all safe
  await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);
  const allSafeItems = Object.values(allAlienItemsObj).filter((item) => !item.nsfw);
  return gameUtils.getRandomItems(allSafeItems, quantity);
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
    .filter((c) => !c.exclusivity || c.exclusivity === language)
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
  let availableContenders = gameUtils.filterOutByIds(contendersResponse, usedContenders);

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
