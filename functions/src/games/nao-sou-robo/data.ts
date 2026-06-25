import { sampleSize, shuffle } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { GalleryEntry, ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { SPRITE_LIBRARIES } from '../../constants/sprites';
import { STARTING_HAND, MAX_ROUNDS, MIN_ROUND_CARDS, CARD_SELECTION_PER_PLAYER_COUNT } from './constants';
// Services
import { updateFirestoreCommunityDataForCards } from '../../services/community-data';
import { updateGlobalTrackerDocumentData } from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Get data
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @returns Resource data containing images, emoji, words, glyphs, colors, emotions, and bot cards
 */
export const getResourceData = async (language: Language, playerCount: number): Promise<ResourceData> => {
  // Calculate cards needed: player cards (starting hand + cards per round) + bot cards per round
  const cardsPerPlayer = STARTING_HAND + MAX_ROUNDS * (CARD_SELECTION_PER_PLAYER_COUNT[playerCount] ?? 3);
  const botCardsNeeded = MAX_ROUNDS * (MIN_ROUND_CARDS - (CARD_SELECTION_PER_PLAYER_COUNT[playerCount] ?? 3));
  const imageCardsNeeded = cardsPerPlayer * playerCount + botCardsNeeded;

  const images = shuffle(await utils.imageCards.getImageCards(imageCardsNeeded));

  const quantityNeeded = Math.ceil(MAX_ROUNDS / 3);

  // Colors
  const allColors = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.COLORS, language);
  const colors = sampleSize(Object.values(allColors), quantityNeeded);

  // Emotions
  const allEmotions = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.EMOTIONS, language);
  const emotions = sampleSize(Object.values(allEmotions), quantityNeeded);

  // Words
  const words = await utils.tdr.getSingleWords(language, quantityNeeded);

  // Glyphs
  const glyphs = sampleSize(utils.helpers.makeArray(SPRITE_LIBRARIES.GLYPHS), quantityNeeded * 3);

  // Emojis
  const emojis = sampleSize(utils.helpers.makeArray(SPRITE_LIBRARIES.EMOJIS), quantityNeeded);

  // Robot cards
  const botCards = utils.helpers
    .makeArray(botCardsNeeded)
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
 * @param language - The language code for the saved data
 * @param gallery - Array of gallery entries with image cards and clues
 * @returns True if save was successful
 */
export const saveData = async (language: Language, gallery: GalleryEntry[]): Promise<boolean> => {
  const usedImageCards: Dictionary<boolean> = {};
  const usedAdjectives: Dictionary<boolean> = {};
  const clues: Record<UID, string[]> = {};

  gallery.forEach((entry) => {
    if (entry.roundType === 'adjectives') {
      const card = entry.values as TextCardData;
      usedAdjectives[card.id] = true;
    }
    let text = '';
    if (entry.roundType === 'words') {
      const card = entry.values as TextCardData;
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
  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedImageCards);
  // Save data relationship for card - clues
  return await updateFirestoreCommunityDataForCards('imageCards', language, clues);
};
