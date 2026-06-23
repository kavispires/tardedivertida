// Constants
import { STARTING_ITEMS_PER_PLAYER_COUNT, ROUNDS_PER_PLAYER, JUDGE_HAND_QUANTITY } from './constants';
import { TDR_RESOURCES } from '../../utils/constants';
import { sampleSize } from 'lodash';
// Type
import type { DiagramTopicData, ItemData } from '../../types/tdr';
import type { TeoriaDeConjuntosOptions, ResourceData, TopicsByDiagramType } from './types';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get items and diagrams for the game
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @param options - Game options including NSFW setting
 * @returns Resource data containing items and diagram topics
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
    filters: [
      (item: ItemData) => {
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
    cleanUp: (item: ItemData) => {
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
  const allCards = await resourceUtils.fetchResource<Dictionary<DiagramTopicData>>(
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
    attribute: sampleSize(attribute, 3),
    word: sampleSize(word, 3),
    context: sampleSize(context ?? [], 3),
  };

  return {
    items,
    diagrams: {
      attribute: sampleSize(attribute, 1)[0],
      word: sampleSize(word, 1)[0],
      context: sampleSize(context ?? [], 1)[0],
    },
    examples,
  };
};
