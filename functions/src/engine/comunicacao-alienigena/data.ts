import { orderBy, shuffle } from 'lodash';
// Types
import type { ItemData, ItemAttributeData, ItemAttributesValuesData } from '../../types/tdr';
import type { AlienItem } from '../../utils/tool-kits/alien-attributes';
import type { ResourceData, ComunicacaoAlienigenaOptions } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { ITEM_TYPES, ITEMS_COUNT, TOTAL_ITEMS } from './constants';
// Tool Kits
import { alienAttributesUtils } from '../../utils/tool-kits';
// Utils
import utils from '../../utils';
import { makeArray } from '../../utils/helpers';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get characters based on the game's language
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @param options - Game options including NSFW setting and bot alien flag
 * @returns Resource data containing alien items and attributes
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  options: ComunicacaoAlienigenaOptions,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;
  const botAlien = !!options.botAlien;

  // Fetch data
  const itemsResource = await resourceUtils.fetchResource<Dictionary<ItemData>>(TDR_RESOURCES.ITEMS);
  const itemsAttributesResource = await resourceUtils.fetchResource<Dictionary<ItemAttributeData>>(
    TDR_RESOURCES.ITEMS_ATTRIBUTES,
  );
  const itemsAttributesValuesResource = await resourceUtils.fetchResource<
    Dictionary<ItemAttributesValuesData>
  >(TDR_RESOURCES.ITEMS_ATTRIBUTE_VALUES);

  const { items, attributes } = alienAttributesUtils.buildAlienGameGrids(
    itemsResource,
    Object.values(itemsAttributesValuesResource),
    Object.values(itemsAttributesResource),
    { nsfw: allowNSFW, itemsGridSize: TOTAL_ITEMS, reliability: botAlien ? 75 : 30 },
  );

  // Attributes: Randomize spriteIds
  const sortedSprites = shuffle(utils.helpers.makeArray(Object.keys(itemsAttributesResource).length, 0));
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
 * @param items - Array of alien items used in the game
 * @returns True if save was successful
 */
export const saveUsedItems = async (items: AlienItem[]): Promise<boolean> => {
  return await utils.tdr.saveUsedAlienItems(items);
};
