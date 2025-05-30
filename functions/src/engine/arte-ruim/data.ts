// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ArteRuimCard, ArteRuimGroup, ArteRuimPair, TextCard } from '../../types/tdr';
import type { ResourceData, ArteRuimDrawing, ArteRuimGameOptions, Level5Type } from './types';
// Helpers
import * as globalUtils from '../global';
import * as dataUtils from '../collections';
import * as resourceUtils from '../resource';
import utils from '../../utils';
import {
  determineNumberOfCards,
  distributeCardsByLevel,
  getAvailableCards,
  getEnoughLevel5Cards,
  getGameSettings,
} from './helpers';
import { SPECIAL_LEVELS_LIBRARIES } from './constants';

const getFinalLevel = async (language: string, playerCount: number, options: ArteRuimGameOptions) => {
  const cardsPerRound = determineNumberOfCards(playerCount);
  const levelQuantity = options.forPoints ? 2 : 1;

  // Regular level 5 uses pairs
  if (!options.specialLevels) {
    const allCardPairsResponse = await resourceUtils.fetchResource<Dictionary<ArteRuimPair>>(
      TDR_RESOURCES.ARTE_RUIM_PAIRS,
      language,
    );
    const shuffledLevel5Deck = utils.game.shuffle(Object.values(allCardPairsResponse));
    return {
      cards: getEnoughLevel5Cards(shuffledLevel5Deck, cardsPerRound),
      types: Array(levelQuantity).fill('pairs' as Level5Type),
    };
  }

  const types = utils.game.getRandomItems(SPECIAL_LEVELS_LIBRARIES, levelQuantity);

  const result: ArteRuimCard[] = [];

  for (const library of types) {
    const document = library === 'contenders' ? library : `${library}-${language}`;
    const response = await resourceUtils.fetchResource<Dictionary<TextCard & PlainObject>>(document);

    const cards = utils.game.shuffle(Object.values(response)).filter((card) => {
      if (library === 'contenders' && card.exclusivity && card.exclusivity !== language) {
        return false;
      }
      return true;
    });
    utils.game.getRandomItems(cards, cardsPerRound).forEach((card) => {
      const newCard = {
        text: card.text,
        id: card.id,
        level: 5,
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
 * @param language
 * @param playerCount
 * @param isShortGame
 * @param useAllCards
 * @returns
 */
export const getCards = async (
  language: string,
  playerCount: number,
  options: ArteRuimGameOptions,
): Promise<ResourceData> => {
  // Get regular cards
  const allCardsResponse = await resourceUtils.fetchResource<Dictionary<ArteRuimCard>>(
    TDR_RESOURCES.ARTE_RUIM_CARDS,
    language,
  );
  const allCards: ArteRuimCard[] = Object.values(allCardsResponse);

  if (options.useAllCards) {
    // Check daily history
    const dailyRef = utils.firestore.getDailyRef(language === 'pt' ? 'diario' : 'daily');
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

  // Get level 4 cards (if not basic levels only)
  const allCardsGroupResponse = needsLevel4
    ? await resourceUtils.fetchResource<Dictionary<ArteRuimGroup>>(TDR_RESOURCES.ARTE_RUIM_GROUPS, language)
    : {};
  const cardsGroups: ArteRuimGroup[] = Object.values(allCardsGroupResponse);

  // Determine level 5 options.specialLevels (adjectives, contenders, movies)
  const specialLevels = needsLevel5 ? await getFinalLevel(language, playerCount, options) : null;

  // If no need for used cards check
  if (options.useAllCards) {
    return {
      allCards: allCardsResponse,
      availableCards: cardsByLevel,
      cardsGroups,
      specialLevels,
    };
  }

  // Get used deck
  const usedCardsIds: BooleanDictionary = await globalUtils.getGlobalFirebaseDocData(
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
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ARTE_RUIM);
  }

  return {
    allCards: allCardsResponse,
    availableCards: cards,
    cardsGroups,
    specialLevels,
  };
};

/**
 * Saves past drawings into a public document depending on the language
 * @param pastDrawings
 * @param language
 */
export const saveUsedCards = async (pastDrawings: ArteRuimDrawing[], language: Language) => {
  const onlyARPDEntries = pastDrawings.filter((entry) => entry.id.includes('a-'));
  // Save usedArteRuimCards to global
  const usedArteRuimCards = utils.helpers.buildBooleanDictionary(onlyARPDEntries);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.ARTE_RUIM, usedArteRuimCards);

  // Save drawings to public gallery
  const endedAt = Date.now();
  const newArteRuimDrawings = onlyARPDEntries.reduce((acc, entry) => {
    acc[`${entry.id}::${endedAt}`] = entry;
    return acc;
  }, {});

  await dataUtils.updateDataCollectionRecursively('drawings', language, newArteRuimDrawings);
};
