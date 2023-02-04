// Constants
import { GLOBAL_USED_DOCUMENTS, DATA_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { CHARACTERS_PER_PLAYER } from './constants';
// Type
import { ResourceData } from './types';
// Helpers
import * as resourceUtils from '../resource';
import * as globalUtils from '../global';
import * as collectionUtils from '../collections';
import utils from '../../utils';

/**
 * Get characters based on the game's language
 * @param language
 * @param playerCount
 * @returns
 */
export const getResourceData = async (language: string, playerCount: number): Promise<ResourceData> => {
  // Get full characters deck
  const charactersResponse: Record<CardId, ContenderCard> = await resourceUtils.fetchResource(
    TDR_RESOURCES.CONTENDERS
  );

  // Get used challenges deck
  const usedCharacters = await globalUtils.getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.SUPER_CAMPEONATO_CONTENDERS,
    {}
  );

  // Get only characters that match the language selected
  const languageCharacters = Object.values(charactersResponse)
    .filter((c) => !c.exclusivity || c.exclusivity === language)
    .reduce((acc: Record<CardId, ContenderCard>, entry) => {
      acc[entry.id] = entry;
      return acc;
    }, {});

  // Filter out used cards
  let availableCharacters: Record<string, ContenderCard> = utils.game.filterOutByIds(
    languageCharacters,
    usedCharacters
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCharacters).length < playerCount * CHARACTERS_PER_PLAYER) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.SUPER_CAMPEONATO_CONTENDERS);
    availableCharacters = languageCharacters;
  }

  return {
    characters: utils.game.shuffle(Object.values(availableCharacters)),
  };
};

/**
 * Saved given contender glyphs
 * @param contendersGlyphs
 * @returns
 */
export const saveContendersGlyphs = async (contendersGlyphs: BooleanDictionary): Promise<boolean> => {
  return await collectionUtils.updateDataFirebaseDoc(DATA_DOCUMENTS.CONTENDERS_GLYPHS, contendersGlyphs);
};
