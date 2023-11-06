// Constants
import { EXTRA_ITEMS, PAIRS_PER_ROUND, TOTAL_ROUNDS } from './constants';
// Type
import { DuetosOptions, ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get characters based on the game's language
 * @param language
 * @param allowNSFW
 * @returns
 */
export const getResourceData = async (language: Language, options: DuetosOptions): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;
  const quantityNeeded = PAIRS_PER_ROUND * 2 + EXTRA_ITEMS;

  let specialDeckTypes: string[] = [];
  if (options.withImages) {
    specialDeckTypes.push('images');
  }
  if (options.withEmojis) {
    specialDeckTypes.push('emojis');
  }
  if (options.withWords) {
    specialDeckTypes.push('words');
  }
  if (options.withSuspects && allowNSFW) {
    specialDeckTypes.push('suspects');
  }
  if (options.withContenders) {
    specialDeckTypes.push('contenders');
  }

  specialDeckTypes = utils.game.getRandomItems(specialDeckTypes, Math.min(specialDeckTypes.length, 3));

  const customRounds = specialDeckTypes.length;

  const itemsNeeded = Math.max(TOTAL_ROUNDS - customRounds, 1) * quantityNeeded;

  const items = await utils.tdr.getAlienItems(itemsNeeded, allowNSFW);

  let images: CardId[] = [];
  if (specialDeckTypes.includes('images')) {
    images = await utils.imageCards.getImageCards(quantityNeeded);
  }

  let emojis: number[] = [];
  if (specialDeckTypes.includes('emojis')) {
    emojis = utils.game.getRandomItems(utils.game.makeArray(30), quantityNeeded);
  }

  let words: TextCard[] = [];
  if (specialDeckTypes.includes('words')) {
    words = await utils.tdr.getSingleWords(language, quantityNeeded);
  }

  let suspects: SuspectCard[] = [];
  if (specialDeckTypes.includes('suspects')) {
    const allSuspects = await resourceUtils.fetchTDIData('us/info');
    suspects = utils.game.getRandomItems(
      utils.imageCards.modifySuspectIdsByOptions(Object.values(allSuspects), {}),
      quantityNeeded
    );
  }

  let contenders: ContenderCard[] = [];
  if (specialDeckTypes.includes('contenders')) {
    contenders = await utils.tdr.getContenders(language, allowNSFW, quantityNeeded);
  }

  return {
    items,
    images,
    emojis,
    words,
    suspects,
    contenders,
    decks: specialDeckTypes,
  };
};

/**
 * Saved used alien item ids
 * @param items
 * @returns
 */
export const saveUsedItems = async (items: AlienItem[]): Promise<boolean> => {
  return await utils.tdr.saveUsedAlienItems(items);
};
