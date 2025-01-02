// Constants
import { ATTRIBUTES, AVAILABLE_SIGNS, TOTAL_ITEMS, TOTAL_SIGNS } from './constants';
// Type
import type { AlienItem, ItemAttribute } from '../../types/tdr';
import type { Item, Sign, ResourceData, ComunicacaoAlienigenaOptions } from './types';
// Helpers
import utils from '../../utils';
import { calculateAttributeUsage, getItems } from './helpers';
import { alienItemUtils } from '../../utils/tdr-utils';
import * as resourceUtils from '../resource';
import { TDR_RESOURCES } from '../../utils/constants';
import { orderBy } from 'lodash';

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
  const isBotAlien = !!options.botAlien;
  const allowNSFW = !!options.nsfw;
  const isEasyGame = !!options.easyMode;
  let botAlienItemKnowledge: Collection<AlienItem> = {};

  // If not bot alien, use new libraries
  if (!isBotAlien) {
    const itemAttributesResponse: Collection<ItemAttribute> = await resourceUtils.fetchResource(
      TDR_RESOURCES.ITEMS_ATTRIBUTES,
    );
    const itemAttributes = utils.game.getRandomItems(
      Object.values(itemAttributesResponse).filter((attribute) => attribute.default),
      TOTAL_ITEMS,
    );

    const fakeAttributesForAliemItemKnowledge = itemAttributes.reduce((acc: PlainObject, attribute) => {
      acc[attribute.id] = 3;
      return acc;
    }, {});

    const itemsSample = await utils.tdr.getItems(TOTAL_ITEMS, {
      allowNSFW,
      decks: ['alien'],
      cleanUp: utils.tdr.itemUtils.cleanupDecks,
    });

    const selectedAlienItems: AlienItem[] = itemsSample.map((item) => ({
      id: item.id,
      name: item.name,
      attributes: fakeAttributesForAliemItemKnowledge,
    }));

    const items: Item[] = getItems(playerCount).map((itemType, index) => ({
      id: selectedAlienItems[index].id,
      name: selectedAlienItems[index].name,
      type: itemType,
      offerings: [],
    }));

    const signIds = utils.game.getRandomItems(
      utils.game.makeArray(Object.values(itemAttributesResponse).length),
      TOTAL_SIGNS,
    );

    // Get random list of attributes and signs, then alphabetically order them
    const signs: Sign[] = orderBy(
      itemAttributes.map((attributeObj, index) => ({
        attribute: itemAttributesResponse[attributeObj.id].name,
        key: itemAttributesResponse[attributeObj.id].id,
        signId: String(signIds[index]),
        description: itemAttributesResponse[attributeObj.id].description,
      })),
      `attribute.${language}`,
      'asc',
    );

    const startingAttributes = utils.game.getRandomItems(signs, isEasyGame ? 3 : 1);

    return {
      items,
      signs,
      botAlienItemKnowledge,
      startingAttributes,
    };
  }

  // Get the 25 needed items randomly
  const selectedAlienItems = await utils.tdr.getAlienItems(TOTAL_ITEMS, {
    allowNSFW,
    filters: [alienItemUtils.notWithinDecks(['no-alien']), alienItemUtils.onlyWithAttributes],
    balanceAttributes: isBotAlien,
  });

  const items: Item[] = getItems(playerCount).map((itemType, index) => ({
    id: selectedAlienItems[index].id,
    type: itemType,
    offerings: [],
  }));

  const selectedAttributesKeys = utils.game.shuffle(calculateAttributeUsage(selectedAlienItems));

  if (isBotAlien) {
    // Cleanup items from attributes not belonging to the game
    selectedAlienItems.forEach((item) => {
      utils.game.getUniqueItems(selectedAttributesKeys, Object.keys(item.attributes)).forEach((attribute) => {
        delete item.attributes[attribute];
      });
    });
    botAlienItemKnowledge = utils.helpers.buildDictionaryFromList(selectedAlienItems, 'id');
  }

  const signIds = utils.game.getRandomItems(utils.game.makeArray(AVAILABLE_SIGNS), TOTAL_SIGNS);

  // Get random list of attributes and signs, then alphabetically order them
  const signs: Sign[] = orderBy(
    selectedAttributesKeys.map((key, index) => ({
      attribute: ATTRIBUTES[key].name,
      key: ATTRIBUTES[key].id,
      signId: String(signIds[index]),
    })),
    `attribute.${language}`,
    'asc',
  );

  const startingAttributes = utils.game.getRandomItems(signs, isEasyGame ? 3 : 1);

  return {
    items,
    signs,
    botAlienItemKnowledge,
    startingAttributes,
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
