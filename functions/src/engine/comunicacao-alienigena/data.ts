// Constants
import { ITEM_TYPES, ITEMS_COUNT, TOTAL_ITEMS } from './constants';
// Type
import type { Item, ItemAttribute, ItemAttributesValues } from '../../types/tdr';
import type { ResourceData, ComunicacaoAlienigenaOptions } from './types';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';
import { TDR_RESOURCES } from '../../utils/constants';
import { orderBy, shuffle } from 'lodash';
import { alienAttributesUtils } from '../../utils/tool-kits';
import { makeArray } from '../../utils/game-utils';
import type { AlienItem } from '../../utils/tool-kits/alien-attributes';

/**
 * Get characters based on the game's language
 * @param language
 * @param playerCount
 * @param botAlien
 * @param allowNSFW
 * @returns
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  options: ComunicacaoAlienigenaOptions,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;
  const botAlien = !!options.botAlien;

  // Fetch data
  const itemsResource = await resourceUtils.fetchResource<Dictionary<Item>>(TDR_RESOURCES.ITEMS);
  const itemsAttributesResource = await resourceUtils.fetchResource<Dictionary<ItemAttribute>>(
    TDR_RESOURCES.ITEMS_ATTRIBUTES,
  );
  const itemsAttributesValuesResource = await resourceUtils.fetchResource<Dictionary<ItemAttributesValues>>(
    TDR_RESOURCES.ITEMS_ATTRIBUTE_VALUES,
  );

  const { items, attributes } = alienAttributesUtils.buildAlienGameGrids(
    itemsResource,
    Object.values(itemsAttributesValuesResource),
    Object.values(itemsAttributesResource),
    { nsfw: allowNSFW, itemsGridSize: TOTAL_ITEMS, reliability: botAlien ? 75 : 30 },
  );

  // Attributes: Randomize spriteIds
  const sortedSprites = shuffle(utils.game.makeArray(Object.keys(itemsAttributesResource).length, 0));
  attributes.forEach((attr, index) => {
    attr.spriteId = `${sortedSprites[index]}`;
  });

  // Items: Distribute types
  const counts = ITEMS_COUNT[playerCount];
  const sortedTypes = shuffle([
    ...makeArray(counts.answers).map(() => {
      return ITEM_TYPES.ITEM;
    }),
    ...makeArray(counts.curses).map(() => {
      return ITEM_TYPES.CURSE;
    }),
    ...makeArray(TOTAL_ITEMS - counts.answers - counts.curses).map(() => {
      return ITEM_TYPES.BLANK;
    }),
  ]);
  items.forEach((item, index) => {
    item.type = sortedTypes[index] as AlienItem['type'];
  });

  // Get initial attributes
  const startingAttributesIds = alienAttributesUtils.getInitialKnownAttributes(items, attributes);

  // Mark starting attributes as known
  startingAttributesIds.forEach((id) => {
    const attr = attributes.find((a) => a.id === id);
    if (attr) {
      attr.known = true;
    }
  });

  return {
    items: orderBy(items, [`name.${language}`], ['asc']),
    attributes: orderBy(attributes, [`name.${language}`], ['asc']),
    startingAttributesIds,
  };
};

/**
 * Saved used alien item ids
 * @param items
 * @returns
 */
export const saveUsedItems = async (items: AlienItem[]): Promise<boolean> => {
  return await utils.tdr.saveUsedAlienItems(items);
};
