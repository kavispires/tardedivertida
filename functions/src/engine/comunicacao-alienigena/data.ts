// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { ATTRIBUTES, TOTAL_ITEMS, TOTAL_SIGNS } from './constants';
// Type
import { Item, Sign, ResourceData } from './types';
// Helpers
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { calculateAttributeUsage, getItems } from './helpers';

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
  // TODO: Revert
  availableAlienItems = Array(TOTAL_ITEMS)
    .fill(0)
    .reduce((acc, _, index) => {
      const id = String(index + 1);
      const alienItem = allAlienItemsObj[id];
      acc[id] = alienItem;
      return acc;
    }, {});

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableAlienItems).length < TOTAL_ITEMS) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS);
    availableAlienItems = allAlienItemsObj;
  }

  let botAlienItemKnowledge: Record<CardId, AlienItem> = {};

  // Get the 25 needed items randomly
  const selectedAlienItems: AlienItem[] = utils.game.getRandomItems(
    Object.values(availableAlienItems),
    TOTAL_ITEMS
  );

  const items: Item[] = getItems(playerCount).map((itemType, index) => ({
    id: selectedAlienItems[index].id,
    type: itemType,
    offerings: [],
  }));

  const selectedAttributesKeys = utils.game.shuffle(calculateAttributeUsage(selectedAlienItems));

  if (botAlien) {
    // Cleanup items from attributes not belonging to the game
    selectedAlienItems.forEach((item) => {
      utils.game.getUniqueItems(selectedAttributesKeys, Object.keys(item.attributes)).forEach((attribute) => {
        delete item.attributes[attribute];
      });
    });
    botAlienItemKnowledge = utils.helpers.buildObjectFromList(selectedAlienItems, 'id');
  }

  const signIds = utils.game.shuffle(utils.game.makeArray(TOTAL_SIGNS));

  // Get random list of attributes and signs, then alphabetically order them
  const signs: Sign[] = utils.helpers.orderBy(
    selectedAttributesKeys.map((key, index) => ({
      attribute: ATTRIBUTES[key].name,
      key: ATTRIBUTES[key].id,
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
  return await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.ALIEN_ITEMS, itemsIdsDict);
};
