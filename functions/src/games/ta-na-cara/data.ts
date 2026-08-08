import { sampleSize } from 'lodash';
// Types
import type { TestimonyStatementCardData } from '../../types/tdr';
import type { ResourceData, TaNaCaraOptions } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { CHARACTER_COUNT, MAX_ROUNDS, PLAYER_COUNTS, PLAYER_SUGGESTED_QUESTIONS_COUNT } from './constants';
// Services
import { fetchGlobalTrackerDocumentData, resetGlobalTrackerDocument } from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Resources
import { getSuspects } from '../../mechanics/resources';
// Utils
import { filterOutByIds } from '../../utils';

/**
 * Get question resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing testimony question cards and suspect cards
 */
export const getResourceData = async (language: string, options: TaNaCaraOptions): Promise<ResourceData> => {
  // Get full deck
  const allCards = await fetchResource<Dictionary<TestimonyStatementCardData>>(
    TDR_RESOURCES.TESTIMONY_STATEMENTS,
    language,
  );
  // Get used deck
  const usedCards = await fetchGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.TESTIMONY_STATEMENTS, {});
  // Get images info
  const allSuspects = await getSuspects({
    styleVariant: options.styleVariant,
    cleanup: true,
    decks: options.everyoneDeck ? ['any'] : ['adult'],
    quantity: CHARACTER_COUNT,
    sortBy: `name.${language}`,
  });

  // Filter out used cards
  const availableCards = Object.values(filterOutByIds(allCards, usedCards)).filter((card) =>
    options.nsfw ? card : !card.nsfw,
  );

  const questionsQuantity = PLAYER_COUNTS.MAX * PLAYER_SUGGESTED_QUESTIONS_COUNT * MAX_ROUNDS;

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCards).length < questionsQuantity) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.TESTIMONY_STATEMENTS);
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
