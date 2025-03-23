// Constants
import { STARTING_ITEMS_PER_PLAYER_COUNT, ROUNDS_PER_PLAYER, JUDGE_HAND_QUANTITY } from './constants';
import { TDR_RESOURCES } from '../../utils/constants';
// Type
import type { DiagramTopic, Item } from '../../types/tdr';
import type { TeoriaDeConjuntosOptions, ResourceData, TopicsByDiagramType } from './types';
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
  options: TeoriaDeConjuntosOptions,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  const startingItemsQuantity = STARTING_ITEMS_PER_PLAYER_COUNT[playerCount] * (playerCount + 1);
  const deckQuantity = STARTING_ITEMS_PER_PLAYER_COUNT[playerCount] + ROUNDS_PER_PLAYER * playerCount;
  const itemsNeeded = deckQuantity + startingItemsQuantity + JUDGE_HAND_QUANTITY;

  const items = await utils.tdr.getItems(itemsNeeded, {
    allowNSFW,
    decks: ['thing', 'manufactured', 'alien'],
    deckFiltering: 'OR',
    filters: [
      (item: Item) => {
        if (item.decks?.includes('thing')) {
          return true;
        }
        if (item.decks?.includes('manufactured') || item.decks?.includes('alien')) {
          const aliases = language === 'en' ? item.aliasesEn : item.aliasesPt;
          // Only use single word items
          return (
            item.name[language].trim().split(' ').length === 1 ||
            !!aliases?.some((alias) => alias.trim().split(' ').length === 1)
          );
        }

        return false;
      },
    ],
    cleanUp: (item: Item) => {
      const i = utils.tdr.itemUtils.cleanupDecks(item);
      // If the name used is not a single word, use the first single word alias
      if (i.name[language].trim().split(' ').length > 1) {
        const aliases = language === 'en' ? item.aliasesEn : item.aliasesPt;
        const alias = aliases?.find((alias) => alias.trim().split(' ').length === 1);
        if (alias) {
          i.name[language] = alias;
        }
      }
      return i;
    },
  });

  // Get full deck
  const allCards = await resourceUtils.fetchResource<Dictionary<DiagramTopic>>(
    TDR_RESOURCES.DIAGRAM_TOPICS,
    language,
  );

  const { attribute, word, context } = Object.values(allCards).reduce(
    (acc: TopicsByDiagramType, card) => {
      if (card.type === 'attribute') {
        acc.attribute.push(card);
      }
      if (card.type === 'word') {
        acc.word.push(card);
      }
      if (card.type === 'context' && acc.context) {
        acc.context.push(card);
      }

      return acc;
    },
    { attribute: [], word: [], context: [] },
  );

  const examples = {
    attribute: utils.game.getRandomItems(attribute, 3),
    word: utils.game.getRandomItems(word, 3),
    context: utils.game.getRandomItems(context, 3),
  };

  return {
    items,
    diagrams: {
      attribute: utils.game.getRandomItem(attribute),
      word: utils.game.getRandomItem(word),
      context: utils.game.getRandomItem(context),
    },
    examples,
  };
};
