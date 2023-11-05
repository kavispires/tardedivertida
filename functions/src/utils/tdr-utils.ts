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

  // If not the minimum items needed, reset and use all
  await firebaseUtils.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);

  const allAvailableItems = Object.values(allAlienItemsObj).filter((item) => !item.nsfw);

  return gameUtils.getRandomItems(allAvailableItems, quantity);
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
