// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { PastClues, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import * as globalUtils from '../global';
import * as dataUtils from '../collections';
import utils from '../../utils';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: string, isImageGrid: boolean): Promise<ResourceData> => {
  if (isImageGrid) {
    // Get full contenders deck
    const contendersResponse: Record<CardId, ContenderCard> = await resourceUtils.fetchResource(
      TDR_RESOURCES.CONTENDERS
    );

    // Get only contenders that match the language selected
    const languageContenders = Object.values(contendersResponse).filter(
      (c) => !c.exclusivity || c.exclusivity === language
    );

    const allWords = languageContenders.reduce((acc, entry) => {
      acc[entry.id] = {
        id: entry.id,
        text: entry.name[language],
      };
      return acc;
    }, {});

    return { allWords };
  }

  const resourceName = `${TDR_RESOURCES.SINGLE_WORDS}-${language}`;
  // Get full deck
  const allWords = await resourceUtils.fetchResource(resourceName);

  return { allWords };
};

export const saveData = async (language: Language, pastClues: PastClues, isImageGrid: boolean) => {
  // Save used cards
  if (!isImageGrid) {
    const usedIds = utils.helpers.buildBooleanDictionary(Object.keys(pastClues));
    await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.SINGLE_WORDS, usedIds);
  }

  // Save card clues data
  await dataUtils.updateCardDataCollection('cards', language, pastClues);
};
