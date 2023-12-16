// Types
import type { PastClues, ResourceData } from './types';
// Utils
import * as dataUtils from '../collections';
import utils from '../../utils';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (
  language: Language,
  isContenderGrid: boolean,
  allowNSFW: boolean
): Promise<ResourceData> => {
  const QUANTITY_NEEDED = 15;
  if (isContenderGrid) {
    const contenders = await utils.tdr.getContenders(language, allowNSFW, QUANTITY_NEEDED);

    const allWords = contenders.reduce((acc, entry) => {
      acc[entry.id] = {
        id: entry.id,
        text: entry.name[language],
      };
      return acc;
    }, {});

    return { allWords: Object.values(allWords) };
  }

  const allWords = await utils.tdr.getSingleWords(language, QUANTITY_NEEDED);

  return { allWords };
};

export const saveData = async (language: Language, pastClues: PastClues, isContenderGrid: boolean) => {
  // Save used cards
  if (!isContenderGrid) {
    const usedIds = utils.helpers.buildBooleanDictionary(Object.keys(pastClues));
    await utils.tdr.saveUsedSingleWords(usedIds);
  }

  // Save card clues data
  await dataUtils.updateCardDataCollection('cards', language, pastClues);
};
