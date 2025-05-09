// Constants
import { DECK_PER_PLAYER, MAX_ROUNDS, MIN_ROUND_CARDS } from './constants';
import { GLOBAL_USED_DOCUMENTS, SPRITE_LIBRARIES, TDR_RESOURCES } from '../../utils/constants';
// Type
import type { TextCard } from '../../types/tdr';
import type { GalleryEntry, ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as dataUtils from '../collections';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get data
 * @param language
 * @param playerCount
 * @returns
 */
export const getResourceData = async (language: Language, playerCount: number): Promise<ResourceData> => {
  const imageCardsNeeded = DECK_PER_PLAYER * MAX_ROUNDS + MAX_ROUNDS * MIN_ROUND_CARDS;

  const images = utils.game.shuffle(await utils.imageCards.getImageCards(imageCardsNeeded));

  const quantityNeeded = Math.ceil(MAX_ROUNDS / 3);

  // Colors
  const allColors = await resourceUtils.fetchResource<Dictionary<TextCard>>(TDR_RESOURCES.COLORS, language);
  const colors = utils.game.getRandomItems(Object.values(allColors), quantityNeeded);

  // Emotions
  const allEmotions = await resourceUtils.fetchResource<Dictionary<TextCard>>(
    TDR_RESOURCES.EMOTIONS,
    language,
  );
  const emotions = utils.game.getRandomItems(Object.values(allEmotions), quantityNeeded);

  // Words
  const words = await utils.tdr.getSingleWords(language, quantityNeeded);

  // Glyphs
  const glyphs = utils.game.getRandomItems(utils.game.makeArray(SPRITE_LIBRARIES.GLYPHS), quantityNeeded * 3);

  // Emojis
  const emojis = utils.game.getRandomItems(utils.game.makeArray(SPRITE_LIBRARIES.EMOJIS), quantityNeeded);

  // Robot cards
  const botCards = utils.game
    .makeArray(MAX_ROUNDS * (MIN_ROUND_CARDS - playerCount))
    .map(() => {
      return images.pop() as string;
    })
    .filter(Boolean);

  return {
    images,
    botCards,
    emojis,
    words,
    glyphs,
    colors,
    emotions,
  };
};

/**
 * Saved used data
 * @param items
 * @returns
 */
export const saveData = async (language: Language, gallery: GalleryEntry[]): Promise<boolean> => {
  const usedImageCards: BooleanDictionary = {};
  const usedAdjectives: BooleanDictionary = {};
  const clues: Record<ImageCardId, string[]> = {};

  gallery.forEach((entry) => {
    if (entry.roundType === 'adjectives') {
      const card = entry.values as TextCard;
      usedAdjectives[card.id] = true;
    }
    let text = '';
    if (entry.roundType === 'words') {
      const card = entry.values as TextCard;
      text = card.text;
    }
    entry.options.forEach((card) => {
      if (text) {
        if (clues[card.id] === undefined) {
          clues[card.id] = [];
        }
        clues[card.id].push(text);
      }
      usedImageCards[card.id] = true;
    });
  });

  // Save adjectives
  await utils.tdr.saveUsedAdjectives(usedAdjectives);
  // Save imageCards
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedImageCards);
  // Save data relationship for card - clues
  return await dataUtils.updateCardDataCollection('imageCards', language, clues);
};
