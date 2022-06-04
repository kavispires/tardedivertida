// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Types
import { BooleanDictionary, Language } from '../../utils/types';
import { ArteRuimData, ArteRuimDrawing } from './types';
// Helpers
import * as globalUtils from '../global';
import * as publicUtils from '../public';
import * as resourceUtils from '../resource';
import * as utils from '../../utils';
import { buildPastDrawingsDict, distributeCardsByLevel, getAvailableCards, getGameSettings } from './helpers';
import { ArteRuimCard, ArteRuimGroup } from '../../utils/tdr';

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
): Promise<ArteRuimData> => {
  const resourceName = `${TDR_RESOURCES.ARTE_RUIM_CARDS}-${language}`;
  // Get regular and level 4 cards
  const allCardsResponse = await resourceUtils.fetchResource(resourceName);
  const allCards: ArteRuimCard[] = Object.values(allCardsResponse);

  const allCardsGroupResponse = await resourceUtils.fetchResource(
    `${TDR_RESOURCES.ARTE_RUIM_GROUPS}-${language}`
  );
  const cardsGroups: ArteRuimGroup[] = Object.values(allCardsGroupResponse);

  const cardsByLevel = distributeCardsByLevel(allCards);

  // If no need for used cards check
  if (useAllCards) {
    return {
      allCards: allCardsResponse,
      availableCards: cardsByLevel,
      cardsGroups,
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
  const drawingDocumentName = language === 'pt' ? 'arteRuimDrawingsPt' : 'arteRuimDrawingsEn';
  const publicDrawings = await publicUtils.getPublicFirebaseDocData(drawingDocumentName, {});
  const newArteRuimDrawings = buildPastDrawingsDict(pastDrawings, publicDrawings);
  await publicUtils.updatePublicFirebaseDoc(drawingDocumentName, newArteRuimDrawings);
};
