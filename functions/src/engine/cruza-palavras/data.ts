// Types
import type { CruzaPalavrasOptions, PastClues, ResourceData } from './types';
// Utils
import * as dataUtils from '../collections';
import utils from '../../utils';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: Language, options: CruzaPalavrasOptions): Promise<ResourceData> => {
  const isContenderGrid = !!options?.contenderGrid;
  const isImageGrid = !!options?.imageGrid;
  const allowNSFW = !!options?.nsfw;
  const quantityNeeded = isImageGrid ? 15 : 30;

  if (isImageGrid) {
    const deck = await utils.imageCards.getImageCards(quantityNeeded);

    return { deck: deck.map((entry) => ({ id: entry, text: entry })) };
  }

  if (isContenderGrid) {
    const contenders = await utils.tdr.getContenders(language, allowNSFW, quantityNeeded);

    const deck = contenders.map((entry) => {
      return {
        id: entry.id,
        text: entry.name[language],
      };
    });

    return { deck };
  }

  const deck = await utils.tdr.getSingleWords(language, quantityNeeded);

  return { deck };
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
