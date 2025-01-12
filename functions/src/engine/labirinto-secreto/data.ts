// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { CARDS_PER_PLAYER, FOREST_HEIGHT, FOREST_WIDTH } from './constants';
// Types
import type { TextCard } from '../../types/tdr';
import type { LabirintoSecretoGameOptions, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import utils from '../../utils';

/**
 * Get cards resources based on the game's language
 * @param language
 * @param playerCount
 * @returns
 */
export const getData = async (
  language: Language,
  playerCount: number,
  options: LabirintoSecretoGameOptions,
): Promise<ResourceData> => {
  // Get Adjectives
  const adjectivesPerPlayer = playerCount * CARDS_PER_PLAYER + 1;
  const adjectives = await utils.tdr.getAdjectives(language, adjectivesPerPlayer);

  if (options.itemTreeType) {
    const items = await utils.tdr.getItems(FOREST_HEIGHT * FOREST_WIDTH, {
      allowNSFW: !!options.nsfw,
      decks: ['alien', 'dream', 'manufactured'],
      cleanUp: utils.tdr.itemUtils.cleanupDecks,
    });

    return {
      forestCards: items.map((item) => ({
        id: item.id,
        text: item.name[language],
      })),
      allCards: adjectives,
    };
  }

  // Get cards
  const resourceName = `${TDR_RESOURCES.TREE_WORDS}-${language}`;
  const allWords = await resourceUtils.fetchResource<Dictionary<TextCard>>(resourceName);

  return {
    forestCards: utils.game.getRandomItems(Object.values(allWords), FOREST_HEIGHT * FOREST_WIDTH),
    allCards: adjectives,
  };
};

// TODO: Add to game over
export const saveData = async (
  usedAdjectives: BooleanDictionary,
  // usedTreeCards: BooleanDictionary,
) => {
  await utils.tdr.saveUsedAdjectives(usedAdjectives);
};
