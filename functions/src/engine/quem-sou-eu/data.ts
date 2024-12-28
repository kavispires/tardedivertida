// Constants
import { GLOBAL_USED_DOCUMENTS, DATA_DOCUMENTS } from '../../utils/constants';
import { CHARACTERS_PER_PLAYER, EXTRA_CHARACTERS, MINIMUM_CHARACTERS } from './constants';
// Type
import type { QuemSouEuOptions, ResourceData } from './types';
// Helpers
import * as globalUtils from '../global';
import * as collectionUtils from '../collections';
import utils from '../../utils';
import type { ContenderCard } from '../../types/tdr';

/**
 * Get characters based on the game's language
 * @param language
 * @param playerCount
 * @returns
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
  const imageCards: ContenderCard[] = (
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
 * @param contendersGlyphs
 * @returns
 */
export const saveData = async (contendersGlyphs: Collection<BooleanDictionary>): Promise<boolean> => {
  const contenderIds = Object.keys(contendersGlyphs).reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.CONTENDERS, contenderIds);

  return await collectionUtils.updateDataFirebaseDoc(DATA_DOCUMENTS.CONTENDERS_GLYPHS, contendersGlyphs);
};
