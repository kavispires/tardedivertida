// Constants
import { GLOBAL_USED_DOCUMENTS, DATA_DOCUMENTS } from '../../utils/constants';
import { CHARACTERS_PER_PLAYER } from './constants';
// Type
import { ResourceData } from './types';
// Helpers
import * as globalUtils from '../global';
import * as collectionUtils from '../collections';
import utils from '../../utils';

/**
 * Get characters based on the game's language
 * @param language
 * @param playerCount
 * @returns
 */
export const getResourceData = async (
  language: Language,
  playerCount: number,
  allowNSFW: boolean
): Promise<ResourceData> => {
  const quantityNeeded = playerCount * CHARACTERS_PER_PLAYER;

  const characters = await utils.tdr.getContenders(language, allowNSFW, quantityNeeded);

  return {
    characters,
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
