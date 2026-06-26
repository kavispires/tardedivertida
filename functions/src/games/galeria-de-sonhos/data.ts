// Types
import type { TextCardData } from '../../types/tdr';
import type { ImageCardMatch, ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { TABLE_DECK_TOTAL } from './constants';
// Services
import { updateFirestoreCommunityDataForCards } from '../../services/community-data';
import { updateGlobalTrackerDocumentData } from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Mechanics
import { getImageCards } from '../../mechanics/image-cards';

/**
 * Get words resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing theme words and image card IDs
 */
export const getWords = async (language: Language): Promise<ResourceData> => {
  // Get full deck
  const allWords = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.THEME_WORDS, language);

  const imageCardIds = await getImageCards(TABLE_DECK_TOTAL);

  return {
    allWords,
    images: imageCardIds,
  };
};

/**
 * Save used image cards and their associated text clues
 * @param language - The language code for the saved data
 * @param bestMatches - Array of image card matches with text descriptions
 */
export const saveData = async (language: Language, bestMatches: ImageCardMatch[]) => {
  const usedCardsIds: Dictionary<boolean> = {};
  const clues = bestMatches.reduce((acc, entry) => {
    usedCardsIds[entry.id] = true;
    if (acc[entry.id] === undefined) {
      acc[entry.id] = [];
    }
    acc[entry.id].push(entry.text);
    return acc;
  }, {});

  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await updateFirestoreCommunityDataForCards('imageCards', language, clues);
};
