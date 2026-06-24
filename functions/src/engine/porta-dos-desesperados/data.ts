// Types
import type { ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import { TOTAL_IMAGE_CARDS } from './constants';
// Utils
import utils from '../../utils';
// Internal
import * as dataUtils from '../collections';
import * as globalUtils from '../global';

/**
 * Get image decks card
 * @returns Resource data containing image card IDs
 */
export const getData = async (): Promise<ResourceData> => {
  // Get image cards
  const cards = await utils.imageCards.getImageCards(TOTAL_IMAGE_CARDS);

  return {
    cards,
  };
};

/**
 * Save used image cards and image to image relationships
 * @param relationships - Dictionary of image card relationships
 */
export const saveData = async (relationships: ImageCardRelationship): Promise<void> => {
  // Collect all ids
  const usedCardsIds: Dictionary<boolean> = utils.helpers.buildBooleanDictionary(Object.keys(relationships));

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await dataUtils.updateImageCardsRelationships(relationships);
};
