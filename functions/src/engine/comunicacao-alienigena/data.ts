// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { ATTRIBUTES, AVAILABLE_ITEMS_COUNT, TOTAL_ITEMS } from './constants';
// Type
import { Item, Sign, ResourceData } from './types';
// Helpers
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
  // Get full alien items deck
  let allAlienItems: AlienItem[] = [];
  let allGlyphs = utils.game
    .getRandomItems(utils.game.makeArray(AVAILABLE_ITEMS_COUNT, 1), TOTAL_ITEMS)
    .map((e) => String(e));
  let botAlienItemKnowledge: Record<CardId, AlienItem> = {};

  if (botAlien) {
    const allAlienItemsObj = await resourceUtils.fetchResource(TDR_RESOURCES.ALIEN_ITEMS);
    allAlienItems = Object.values(allAlienItemsObj);

    const selectedAlienItems = utils.game.getRandomItems(allAlienItems, TOTAL_ITEMS);

    allGlyphs = selectedAlienItems.map((entry) => entry.id);
    botAlienItemKnowledge = utils.helpers.buildObjectFromList(selectedAlienItems, 'id');
  }

  const items: Item[] = getItems(playerCount + (botAlien ? 1 : 0)).map((itemType, index) => ({
    id: allGlyphs[index],
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
