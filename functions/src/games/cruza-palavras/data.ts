import { sampleSize } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { CruzaPalavrasOptions, PastClues, ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
// Services
import { updateFirestoreCommunityDataForCards } from '../../services/community-data';
import { fetchResource } from '../../services/resource';
// Resources
import { getContenders, getItems, getSingleWords, saveUsedSingleWords } from '../../mechanics/resources';
// Mechanics
import { getImageCards } from '../../mechanics/image-cards';
// Utils
import { buildBooleanDictionary } from '../../utils';

/**
 * Get words resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including grid type and NSFW setting
 * @returns Resource data containing deck of cards for the grid
 */
export const getWords = async (language: Language, options?: CruzaPalavrasOptions): Promise<ResourceData> => {
  const allowNSFW = !!options?.nsfw;
  const quantityNeeded = options?.gridType === 'imageCards' ? 15 : 28;

  if (options?.gridType === 'properties') {
    const allCards = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.THINGS_QUALITIES, language);
    // Does not need type because it is just text
    return { deck: sampleSize(Object.values(allCards), quantityNeeded) };
  }

  if (options?.gridType === 'imageCards') {
    const deck = await getImageCards(quantityNeeded);
    return { deck: deck.map((entry) => ({ id: entry, text: entry, type: 'image' })) };
  }

  if (options?.gridType === 'contenders') {
    const contenders = await getContenders(language, allowNSFW, [], quantityNeeded);

    const deck = contenders.map((entry) => {
      return {
        id: entry.id,
        text: entry.name[language],
        type: 'contender',
      };
    });

    return { deck };
  }

  if (options?.gridType === 'items') {
    const items = await getItems(quantityNeeded, {
      allowNSFW,
      decks: ['alien', 'dream', 'manufactured', 'thing'],
    });

    const deck = items.map((entry) => {
      return {
        id: entry.id,
        text: entry.name[language],
        type: 'item',
      };
    });

    return { deck };
  }

  const deck = await getSingleWords(language, quantityNeeded);

  return { deck };
};

/**
 * Save used cards and player clues
 * @param language - The language code for the saved data
 * @param pastClues - Dictionary of card IDs to their associated clues
 * @param isContenderGrid - Whether the grid uses contenders instead of regular cards
 */
export const saveData = async (language: Language, pastClues: PastClues, isContenderGrid: boolean) => {
  // Save used cards
  if (!isContenderGrid) {
    const usedIds = buildBooleanDictionary(Object.keys(pastClues));
    await saveUsedSingleWords(usedIds);
  }

  // Save card clues data
  await updateFirestoreCommunityDataForCards('cards', language, pastClues);
};
