// Types
import type { ColegasDeQuartoOptions, PastClues, ResourceData } from './types';
import type { TextCard } from '../../types/tdr';
import { sampleSize } from 'lodash';
// Utils
import * as dataUtils from '../collections';
import utils from '../../utils';
import * as resourceUtils from '../resource';
import { TDR_RESOURCES } from '../../utils/constants';
import { TOTAL_ROUNDS, WORDS_IN_POOL } from './constants';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (
  language: Language,
  options?: ColegasDeQuartoOptions,
): Promise<ResourceData> => {
  const quantityNeeded = WORDS_IN_POOL * TOTAL_ROUNDS;

  if (options?.wordsSource === 'properties') {
    const allCards = await resourceUtils.fetchResource<Dictionary<TextCard>>(
      TDR_RESOURCES.THINGS_QUALITIES,
      language,
    );
    // Does not need type because it is just text
    return { deck: sampleSize(Object.values(allCards), quantityNeeded) };
  }

  const deck = await utils.tdr.getSingleWords(language, quantityNeeded);

  return { deck };
};

export const saveData = async (language: Language, pastClues: PastClues) => {
  const usedIds = utils.helpers.buildBooleanDictionary(Object.keys(pastClues));
  await utils.tdr.saveUsedSingleWords(usedIds);

  // Save card clues data
  await dataUtils.updateCardDataCollection('cards', language, pastClues);
};
