// Types
import type { ContenderCardData } from '../../types/tdr';
import type { QuemSouEuOptions, ResourceData } from './types';
// Constants
import { DATA_DOCUMENTS, GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { CHARACTERS_PER_PLAYER, EXTRA_CHARACTERS, MINIMUM_CHARACTERS } from './constants';
// Services
import { updateFirestoreCommunityData } from '../../services/community-data';
import { updateGlobalTrackerDocumentData } from '../../services/global-tracker';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Get characters based on the game's language
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @param options - Game options including NSFW setting, image cards mode, and contender decks
 * @returns Resource data containing character cards or image cards
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  options: QuemSouEuOptions,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;
  const imageCardsMode = !!options.imageCardsMode;

  const quantityNeeded =
    (Math.max(playerCount, MINIMUM_CHARACTERS) + EXTRA_CHARACTERS) * CHARACTERS_PER_PLAYER;

  const characters = imageCardsMode
    ? []
    : await utils.tdr.getContenders(language, allowNSFW, options.contenderDecks, quantityNeeded);
  const imageCards: ContenderCardData[] = (
    imageCardsMode ? await utils.imageCards.getImageCards(quantityNeeded) : []
  ).map((cardId) => ({
    id: cardId,
    name: {
      pt: `image-card-${cardId}`,
      en: `image-card-${cardId}`,
    },
  }));

  return {
    characters,
    imageCards,
  };
};

/**
 * Saved given contender glyphs
 * @param contendersGlyphs - Dictionary mapping contender IDs to their associated glyphs
 * @returns True if save was successful
 */
export const saveData = async (contendersGlyphs: Dictionary<Dictionary<boolean>>): Promise<boolean> => {
  const contenderIds = Object.keys(contendersGlyphs).reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});

  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.CONTENDERS, contenderIds);

  return await updateFirestoreCommunityData(DATA_DOCUMENTS.CONTENDERS_GLYPHS, contendersGlyphs);
};
