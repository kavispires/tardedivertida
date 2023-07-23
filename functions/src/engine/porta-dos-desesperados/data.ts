// Constants
import { TOTAL_IMAGE_CARDS } from './constants';
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as dataUtils from '../collections';
import * as globalUtils from '../global';

/**
 * Get image decks card
 * @param allImageDecks
 * @returns
 */
export const getData = async (allImageDecks: boolean): Promise<ResourceData> => {
  // Get image cards
  const cards = await utils.imageCards.getImageCards(TOTAL_IMAGE_CARDS, allImageDecks);

  return {
    cards,
  };
};

/**
 * Save used image cards and image to image relationships
 * @param something
 * @returns
 */
export const saveData = async (relationships: ImageCardRelationship): Promise<void> => {
  // Collect all ids
  const usedCardsIds: BooleanDictionary = utils.helpers.buildBooleanDictionary(Object.keys(relationships));

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await dataUtils.updateImageCardsRelationships(relationships);
};
