// Types
import type { ComunicacaoDuoOptions, ResourceData } from './types';
// Constants
import { TOTAL_ITEMS } from './constants';
// Resources
import { getContenders, getItems, getSingleWords, getSuspects } from '../../mechanics/resources';
// Mechanics
import { getImageCards } from '../../mechanics/image-cards';
// Internal
import { applyDataToDeck } from './helpers';

/**
 * Get words resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting and deck type selection
 * @returns Resource data containing deck based on selected type (items, images, words, contenders, or suspects)
 */
export const getDeck = async (language: Language, options: ComunicacaoDuoOptions): Promise<ResourceData> => {
  const allowNSFW = !!options?.nsfw;
  const deckType = options?.deckType ?? 'items';

  if (deckType === 'items') {
    const items = await getItems(TOTAL_ITEMS, {
      allowNSFW,
      decks: ['alien'],
    });

    return { deck: applyDataToDeck(items, 'items') };
  }

  if (deckType === 'images') {
    const images = await getImageCards(TOTAL_ITEMS);
    return { deck: applyDataToDeck(images, 'images') };
  }

  if (deckType === 'words') {
    const words = await getSingleWords(language, TOTAL_ITEMS);
    return { deck: applyDataToDeck(words, 'words') };
  }

  if (deckType === 'contenders') {
    const contenders = await getContenders(language, allowNSFW, ['any'], TOTAL_ITEMS);
    return { deck: applyDataToDeck(contenders, 'contenders') };
  }

  if (deckType === 'suspects') {
    const suspects = await getSuspects({
      randomStyleVariant: true,
      quantity: TOTAL_ITEMS,
      cleanup: true,
      sortBy: `name.${language}`,
    });

    return { deck: applyDataToDeck(suspects, 'suspects') };
  }

  return { deck: [] };
};
