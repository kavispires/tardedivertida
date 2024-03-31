// Constants
import { STARTING_ITEMS_PER_PLAYER_COUNT, MAX_ROUNDS_PER_PLAYER } from './constants';
import { TDR_RESOURCES } from '../../utils/constants';
// Type
import { DiagramTopic, Item } from '../../types/tdr';
import { TeoriaDeConjuntosOptions, ResourceData, TopicsByDiagramType } from './types';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get items and diagrams for the game
 * @param language
 * @param playerCount
 * @param allowNSFW
 * @returns
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  options: TeoriaDeConjuntosOptions
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  const startingItemsQuantity = STARTING_ITEMS_PER_PLAYER_COUNT[playerCount] * playerCount;
  const deckQuantity = MAX_ROUNDS_PER_PLAYER * playerCount;
  const itemsNeeded = deckQuantity + startingItemsQuantity;

  const items = await utils.tdr.getItems(itemsNeeded, {
    allowNSFW,
    groups: ['thing', 'mesmice', 'dream'],
    filters: [
      (item: Item) => {
        if (item.groups?.includes('thing')) {
          return true;
        }
        if (item.groups?.includes('mesmice') || item.groups?.includes('dream')) {
          // Only use single word items
          return item.name[language].split(' ').length === 1;
        }

        return false;
      },
    ],
    cleanUp: utils.tdr.itemUtils.cleanupGroups,
  });

  const resourceName = `${TDR_RESOURCES.DIAGRAM_TOPICS}-${language}`;
  // Get full deck
  const allCards: Collection<DiagramTopic> = await resourceUtils.fetchResource(resourceName);

  const { attribute, word, context } = Object.values(allCards).reduce(
    (acc: TopicsByDiagramType, card) => {
      if (card.type === 'attribute') {
        acc.attribute.push(card);
      }
      if (card.type === 'word') {
        acc.word.push(card);
      }
      if (card.type === 'context') {
        acc.context!.push(card);
      }

      return acc;
    },
    { attribute: [], word: [], context: [] }
  );

  const examples = {
    attribute: utils.game.getRandomItems(attribute, 3),
    word: utils.game.getRandomItems(word, 3),
    context: utils.game.getRandomItems(context!, 3),
  };

  return {
    items,
    diagrams: {
      attribute: utils.game.getRandomItem(attribute),
      word: utils.game.getRandomItem(word),
      context: utils.game.getRandomItem(context!),
    },
    examples,
  };
};
