// Types
import type { TestimonyQuestionCardData } from '../../types/tdr';
import type { ResourceData, TaNaCaraOptions } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { CHARACTER_COUNT, MAX_ROUNDS, PLAYER_COUNTS, PLAYER_SUGGESTED_QUESTIONS_COUNT } from './constants';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import { sampleSize } from 'lodash';

/**
 * Get question resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing testimony question cards and suspect cards
 */
export const getResourceData = async (language: string, options: TaNaCaraOptions): Promise<ResourceData> => {
  // Get full deck
  const allCards = await resourceUtils.fetchResource<Dictionary<TestimonyQuestionCardData>>(
    TDR_RESOURCES.TESTIMONY_QUESTIONS,
    language,
  );
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS, {});
  // Get images info
  const allSuspects = await utils.tdr.getSuspects({
    styleVariant: options.styleVariant,
    cleanup: true,
    decks: options.everyoneDeck ? ['any'] : ['adult'],
    quantity: CHARACTER_COUNT,
    sortBy: `name.${language}`,
  });

  // Filter out used cards
  const availableCards = Object.values(utils.game.filterOutByIds(allCards, usedCards)).filter((card) =>
    options.nsfw ? card : !card.nsfw,
  );

  const questionsQuantity = PLAYER_COUNTS.MAX * PLAYER_SUGGESTED_QUESTIONS_COUNT * MAX_ROUNDS;

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCards).length < questionsQuantity) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.TESTIMONY_QUESTIONS);
    return {
      questions: sampleSize(
        options.nsfw ? Object.values(allCards) : Object.values(allCards).filter((card) => !card.nsfw),
        questionsQuantity,
      ),
      characters: allSuspects,
    };
  }

  return {
    questions: sampleSize(availableCards, questionsQuantity),
    characters: allSuspects,
  };
};
