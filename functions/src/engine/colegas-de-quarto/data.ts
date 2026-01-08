// Types
import type { ColegasDeQuartoOptions, PastClues, ResourceData } from './types';
import type { TextCard } from '../../types/tdr';
// Utils
import * as dataUtils from '../collections';
import utils from '../../utils';
import * as resourceUtils from '../resource';
import { TDR_RESOURCES } from '../../utils/constants';
import { EXTRA_WORDS_IN_POOL, SETTINGS_PER_PLAYER_COUNT, TOTAL_ROUNDS } from './constants';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (
  language: Language,
  playerCount: number,
  options?: ColegasDeQuartoOptions,
): Promise<ResourceData> => {
  const quantityNeeded =
    ((SETTINGS_PER_PLAYER_COUNT[playerCount]?.totalWords ?? 13) + EXTRA_WORDS_IN_POOL) * TOTAL_ROUNDS;

  if (options?.wordsSource === 'properties') {
    const allCards = await resourceUtils.fetchResource<Dictionary<TextCard>>(
      TDR_RESOURCES.THINGS_QUALITIES,
      language,
    );
    // Does not need type because it is just text
    return { deck: utils.game.getRandomItems(Object.values(allCards), quantityNeeded) };
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
