// Constants
import { ATTRIBUTES, AVAILABLE_SIGNS, TOTAL_ITEMS, TOTAL_SIGNS } from './constants';
// Type
import { Item, Sign, ResourceData, ComunicacaoAlienigenaOptions } from './types';
// Helpers
import utils from '../../utils';
import { calculateAttributeUsage, getItems } from './helpers';

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
  options: ComunicacaoAlienigenaOptions
): Promise<ResourceData> => {
  const isBotAlien = !!options.botAlien;
  const allowNSFW = !!options.nsfw;
  const isEasyGame = !!options.easyMode;

  let botAlienItemKnowledge: Collection<AlienItem> = {};

  // Get the 25 needed items randomly
  const selectedAlienItems = await utils.tdr.getAlienItems(TOTAL_ITEMS, allowNSFW);

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
    botAlienItemKnowledge = utils.helpers.buildObjectFromList(selectedAlienItems, 'id');
  }

  const signIds = utils.game.getRandomItems(utils.game.makeArray(AVAILABLE_SIGNS), TOTAL_SIGNS);

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
