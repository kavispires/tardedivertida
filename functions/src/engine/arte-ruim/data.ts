// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Types
import type { BooleanDictionary, Language } from '../../utils/types';
import type { ResourceData, ArteRuimDrawing } from './types';
import type { ArteRuimCard, ArteRuimGroup, ArteRuimPair } from '../../utils/tdr';
// Helpers
import * as globalUtils from '../global';
import * as publicUtils from '../public';
import * as resourceUtils from '../resource';
import * as utils from '../../utils';
import { buildPastDrawingsDict, distributeCardsByLevel, getAvailableCards, getGameSettings } from './helpers';

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
  isShortGame: boolean,
  useAllCards: boolean
): Promise<ResourceData> => {
  // Get regular cards
  const allCardsResponse = await resourceUtils.fetchResource(`${TDR_RESOURCES.ARTE_RUIM_CARDS}-${language}`);
  const allCards: ArteRuimCard[] = Object.values(allCardsResponse);
  const cardsByLevel = distributeCardsByLevel(allCards);

  // Get level 4 cards
  const allCardsGroupResponse = await resourceUtils.fetchResource(
    `${TDR_RESOURCES.ARTE_RUIM_GROUPS}-${language}`
  );
  const cardsGroups: ArteRuimGroup[] = Object.values(allCardsGroupResponse);

  // Get level 5 cards
  const allCardPairsResponse = await resourceUtils.fetchResource(
    `${TDR_RESOURCES.ARTE_RUIM_PAIRS}-${language}`
  );
  const cardsPairs: ArteRuimPair[] = Object.values(allCardPairsResponse);

  // If no need for used cards check
  if (useAllCards) {
    return {
      allCards: allCardsResponse,
      availableCards: cardsByLevel,
      cardsGroups,
      cardsPairs,
    };
  }

  // Get used deck
  const usedCardsIds: BooleanDictionary = await globalUtils.getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.ARTE_RUIM,
    {}
  );

  const settings = getGameSettings(isShortGame);

  const { cards, resetUsedCards } = getAvailableCards(
    cardsByLevel,
    usedCardsIds,
    settings.LEVELS,
    playerCount
  );

  if (resetUsedCards) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ARTE_RUIM);
  }

  return {
    allCards: allCardsResponse,
    availableCards: cards,
    cardsGroups,
    cardsPairs,
  };
};

/**
 * Saves past drawings into a public document depending on the language
 * @param pastDrawings
 * @param language
 */
export const saveUsedCards = async (pastDrawings: ArteRuimDrawing[], language: Language) => {
  // Save usedArteRuimCards to global
  const usedArteRuimCards = utils.helpers.buildIdDictionary(pastDrawings);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.ARTE_RUIM, usedArteRuimCards);
  // Save drawings to public gallery
  const drawingDocumentName = language === 'pt' ? 'arteRuimDrawingsPt2' : 'arteRuimDrawingsEn2';
  const publicDrawings = await publicUtils.getPublicFirebaseDocData(drawingDocumentName, {});
  const newArteRuimDrawings = buildPastDrawingsDict(pastDrawings, publicDrawings);
  await publicUtils.updatePublicFirebaseDoc(drawingDocumentName, newArteRuimDrawings);
};
