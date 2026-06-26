import { sampleSize } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { LabirintoSecretoGameOptions, ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
import { CARDS_PER_PLAYER, FOREST_HEIGHT, FOREST_WIDTH } from './constants';
// Services
import { fetchResource } from '../../services/resource';
// Resources
import { getItems, itemUtils, getAdjectives, saveUsedAdjectives } from '../../mechanics/resources';

/**
 * Get cards resources based on the game's language
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @param options - Game options including tree type and NSFW setting
 * @returns Resource data containing forest cards and adjective cards
 */
export const getData = async (
  language: Language,
  playerCount: number,
  options: LabirintoSecretoGameOptions,
): Promise<ResourceData> => {
  // Get Adjectives
  const adjectivesPerPlayer = playerCount * CARDS_PER_PLAYER + 1;
  const adjectives = await getAdjectives(language, adjectivesPerPlayer);

  if (options.itemTreeType) {
    const items = await getItems(FOREST_HEIGHT * FOREST_WIDTH, {
      allowNSFW: !!options.nsfw,
      decks: ['alien', 'dream', 'manufactured'],
      deckFiltering: 'OR',
      cleanUp: itemUtils.cleanupDecks,
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
  const allWords = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.TREE_WORDS, language);

  const filtered = options.includePrivateTrees
    ? Object.values(allWords)
    : Object.values(allWords).filter((card) => !card.private);

  return {
    forestCards: sampleSize(filtered, FOREST_HEIGHT * FOREST_WIDTH),
    allCards: adjectives,
  };
};

/**
 * Save used adjectives to global document
 * @param usedAdjectives - Dictionary of used adjective IDs
 */
export const saveData = async (
  usedAdjectives: Dictionary<boolean>,
  // usedTreeCards: Dictionary<boolean>,
) => {
  await saveUsedAdjectives(usedAdjectives);
};
