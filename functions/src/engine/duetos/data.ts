// Constants
import { EXTRA_ITEMS, PAIRS_PER_ROUND, TOTAL_ROUNDS } from './constants';
import { AVATAR_SPRITE_LIBRARIES, SPRITE_LIBRARIES, TDR_RESOURCES } from '../../utils/constants';
// Type
import { Item, ContenderCard, SuspectCard, TextCard } from '../../types/tdr';
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
  if (options.withAvatars) {
    specialDeckTypes.push(
      utils.game.getRandomItem(['superHeroes', 'clubbers', 'superHeroes', 'clubbers', 'costumes'])
    );
  }
  if (options.withSprites) {
    specialDeckTypes.push(utils.game.getRandomItem(['emojis', 'glyphs', 'glyphs']));
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

  const items = await utils.tdr.getItems(itemsNeeded, {
    allowNSFW,
    decks: ['alien', 'dream', 'manufactured'],
    cleanUp: utils.tdr.itemUtils.cleanupDecks,
  });

  let images: CardId[] = [];
  if (specialDeckTypes.includes('images')) {
    images = await utils.imageCards.getImageCards(quantityNeeded);
  }

  let emojis: number[] = [];
  if (specialDeckTypes.includes('emojis')) {
    emojis = utils.game.getRandomItems(utils.game.makeArray(SPRITE_LIBRARIES.EMOJIS), quantityNeeded);
  }

  let glyphs: number[] = [];
  if (specialDeckTypes.includes('glyphs')) {
    glyphs = utils.game.getRandomItems(utils.game.makeArray(SPRITE_LIBRARIES.GLYPHS), quantityNeeded);
  }

  let superHeroes: number[] = [];
  if (specialDeckTypes.includes('superHeroes')) {
    superHeroes = utils.game.getRandomItems(
      utils.game.makeArray(AVATAR_SPRITE_LIBRARIES.SUPER_HEROES),
      quantityNeeded
    );
  }

  let clubbers: number[] = [];
  if (specialDeckTypes.includes('clubbers')) {
    clubbers = utils.game.getRandomItems(
      utils.game.makeArray(AVATAR_SPRITE_LIBRARIES.CLUBBERS),
      quantityNeeded
    );
  }

  let costumes: number[] = [];
  if (specialDeckTypes.includes('costumes')) {
    costumes = utils.game.getRandomItems(
      utils.game.makeArray(AVATAR_SPRITE_LIBRARIES.COSTUMES),
      quantityNeeded
    );
  }

  let words: TextCard[] = [];
  if (specialDeckTypes.includes('words')) {
    words = await utils.tdr.getSingleWords(language, quantityNeeded);
  }

  let suspects: SuspectCard[] = [];
  if (specialDeckTypes.includes('suspects')) {
    const allSuspects = await resourceUtils.fetchResource(TDR_RESOURCES.SUSPECTS);
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
    glyphs,
    superHeroes,
    clubbers,
    costumes,
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
export const saveUsedItems = async (items: Item[]): Promise<boolean> => {
  return await utils.tdr.saveUsedItems(items);
};
