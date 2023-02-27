// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { ATTRIBUTES, TOTAL_ITEMS } from './constants';
// Type
import { Item, Sign, ResourceData } from './types';
// Helpers
import * as collectionUtils from '../collections';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { getItems } from './helpers';

/**
 * Get characters based on the game's language
 * @param language
 * @param playerCount
 * @param botAlien
 * @returns
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  botAlien: boolean
): Promise<ResourceData> => {
  const allAlienItemsObj: Record<CardId, AlienItem> = await resourceUtils.fetchResource(
    TDR_RESOURCES.ALIEN_ITEMS
  );

  // Get used items deck
  const usedItems: BooleanDictionary = await globalUtils.getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS,
    {}
  );

  // Filter out used items
  let availableAlienItems: Record<string, AlienItem> = utils.game.filterOutByIds(allAlienItemsObj, usedItems);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableAlienItems).length < TOTAL_ITEMS) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);
    availableAlienItems = allAlienItemsObj;
  }

  let botAlienItemKnowledge: Record<CardId, AlienItem> = {};

  // Get the 25 needed items randomly
  const selectedAlienItems: AlienItem[] = utils.game.getRandomItems(
    Object.values(allAlienItemsObj),
    TOTAL_ITEMS
  );

  if (botAlien) {
    botAlienItemKnowledge = utils.helpers.buildObjectFromList(selectedAlienItems, 'id');
  }

  const items: Item[] = getItems(playerCount + (botAlien ? 1 : 0)).map((itemType, index) => ({
    id: selectedAlienItems[index].id,
    type: itemType,
    offerings: [],
  }));

  const signIds = utils.game.shuffle(utils.game.makeArray(TOTAL_ITEMS));

  // Get random list of attributes and signs, then alphabetically order them
  const signs: Sign[] = utils.helpers.orderBy(
    utils.game.shuffle(utils.game.makeArray(ATTRIBUTES.length)).map((id, index) => ({
      attribute: ATTRIBUTES[id].name,
      key: ATTRIBUTES[id].id,
      signId: String(signIds[index]),
    })),
    `attribute.${language}`,
    'asc'
  );

  return {
    items,
    signs,
    botAlienItemKnowledge,
  };
};

/**
 * Saved used alien item ids
 * @param itemsIdsDict
 * @returns
 */
export const saveUsedItems = async (itemsIdsDict: BooleanDictionary): Promise<boolean> => {
  return await collectionUtils.updateDataFirebaseDoc(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS, itemsIdsDict);
};
