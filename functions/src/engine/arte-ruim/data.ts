import { sampleSize, shuffle } from 'lodash';
// Types
import type { ArteRuimCardData, ArteRuimGroupData, ArteRuimPairData, TextCardData } from '../../types/tdr';
import type { ResourceData, ArteRuimDrawing, ArteRuimGameOptions, Level4Type } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { SPECIAL_LEVELS_LIBRARIES } from './constants';
// Services
import { updateFirestoreCommunityDataRecursively } from '../../services/community-data';
import { getDailyCollectionRef } from '../../services/firestore-core';
import {
  fetchGlobalTrackerDocumentData,
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
} from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Utils
import utils from '../../utils';
// Internal
import {
  determineNumberOfCards,
  distributeCardsByLevel,
  getAvailableCards,
  getEnoughLevel4Cards,
  getGameSettings,
} from './helpers';

const getPairsLevel = async (language: string, playerCount: number, options: ArteRuimGameOptions) => {
  const cardsPerRound = determineNumberOfCards(playerCount);
  const levelQuantity = options.forPoints ? 2 : 1;

  // Regular level 4 uses pairs
  if (!options.specialLevels) {
    const allCardPairsResponse = await fetchResource<Dictionary<ArteRuimPairData>>(
      TDR_RESOURCES.ARTE_RUIM_PAIRS,
      language,
    );
    const shuffledLevel4Deck = shuffle(Object.values(allCardPairsResponse));
    return {
      cards: getEnoughLevel4Cards(shuffledLevel4Deck, cardsPerRound),
      types: Array(levelQuantity).fill('pairs' as Level4Type),
    };
  }

  const types = sampleSize(SPECIAL_LEVELS_LIBRARIES, levelQuantity);

  const result: ArteRuimCardData[] = [];

  for (const library of types) {
    const document = library === 'contenders' ? library : `${library}-${language}`;
    const response = await fetchResource<Dictionary<TextCardData & PlainObject>>(document);

    const cards = shuffle(Object.values(response)).filter((card) => {
      if (library === 'contenders' && card.exclusivity && card.exclusivity !== language) {
        return false;
      }
      return true;
    });
    sampleSize(cards, cardsPerRound).forEach((card) => {
      const newCard = {
        text: card.text,
        id: card.id,
        level: 4,
      };

      if (library === 'contenders') {
        newCard.text = card.name[language];
      }
      if (library === 'movies') {
        newCard.text = `${card.prefix} ${card.suffix}`;
      }

      result.push(newCard);
    });
  }

  return {
    cards: result,
    types,
  };
};

/**
 * Get expression cards resource based on the game's language
 * @param language - The language code for localized resources
 * @param playerCount - Number of players in the game
 * @param options - Game options including special levels, points mode, and card selection
 * @returns Resource data containing arte ruim cards by level and special level types
 */
export const getCards = async (
  language: string,
  playerCount: number,
  options: ArteRuimGameOptions,
): Promise<ResourceData> => {
  // Get regular cards
  const allCardsResponse = await fetchResource<Dictionary<ArteRuimCardData>>(
    TDR_RESOURCES.ARTE_RUIM_CARDS,
    language,
  );
  const allCards: ArteRuimCardData[] = Object.values(allCardsResponse);

  if (options.useAllCards) {
    // Check daily history
    const dailyRef = getDailyCollectionRef(language === 'pt' ? 'diario' : 'daily');
    const historyDoc = await dailyRef.doc('history').get();
    const history = historyDoc.data() || { used: [] };
    const usedCards: string[] = history.used;

    // Remove any used cards in daily history
    usedCards.forEach((usedCardId) => {
      delete allCardsResponse[usedCardId];
    });
  }

  const cardsByLevel = distributeCardsByLevel(allCards);

  const needsLevel4 = !options.basicLevelsOnly;
  const needsLevel5 = !options.basicLevelsOnly;

  // Get level 4 cards - pairs (if not basic levels only)
  const allCardPairsResponse = needsLevel4
    ? await fetchResource<Dictionary<ArteRuimPairData>>(TDR_RESOURCES.ARTE_RUIM_PAIRS, language)
    : {};
  const cardsPairs: ArteRuimPairData[] = Object.values(allCardPairsResponse);

  // Get level 5 cards - groups (if not basic levels only)
  const allCardsGroupResponse = needsLevel5
    ? await fetchResource<Dictionary<ArteRuimGroupData>>(TDR_RESOURCES.ARTE_RUIM_GROUPS, language)
    : {};
  const cardsGroups: ArteRuimGroupData[] = Object.values(allCardsGroupResponse);

  // Determine level 4 special levels (adjectives, contenders, movies)
  const specialLevels = needsLevel4 ? await getPairsLevel(language, playerCount, options) : null;

  // If no need for used cards check
  if (options.useAllCards) {
    return {
      allCards: allCardsResponse,
      availableCards: cardsByLevel,
      cardsPairs,
      cardsGroups,
      specialLevels,
    };
  }

  // Get used deck
  const usedCardsIds: Dictionary<boolean> = await fetchGlobalTrackerDocumentData(
    GLOBAL_USED_DOCUMENTS.ARTE_RUIM,
    {},
  );

  const settings = getGameSettings(options);

  const { cards, resetUsedCards } = getAvailableCards(
    cardsByLevel,
    usedCardsIds,
    settings.LEVELS,
    playerCount,
  );

  if (resetUsedCards) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.ARTE_RUIM);
  }

  return {
    allCards: allCardsResponse,
    availableCards: cards,
    cardsPairs,
    cardsGroups,
    specialLevels,
  };
};

/**
 * Saves past drawings into a public document depending on the language
 * @param pastDrawings - Array of arte ruim drawings from the game
 * @param language - The language code for the saved data
 */
export const saveUsedCards = async (pastDrawings: ArteRuimDrawing[], language: Language) => {
  const onlyARPDEntries = pastDrawings.filter((entry) => entry.id.includes('a-'));
  // Save usedArteRuimCards to global
  const usedArteRuimCards = utils.helpers.buildBooleanDictionary(onlyARPDEntries);
  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.ARTE_RUIM, usedArteRuimCards);

  // Save drawings to public gallery
  const endedAt = Date.now();
  const newArteRuimDrawings = onlyARPDEntries.reduce((acc, entry) => {
    acc[`${entry.id}::${endedAt}`] = entry;
    return acc;
  }, {});

  await updateFirestoreCommunityDataRecursively('drawings', language, newArteRuimDrawings);
};
