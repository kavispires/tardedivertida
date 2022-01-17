// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Types
import { Language } from '../../utils/types';
import { ArteRuimDrawing } from './types';
// Helpers
import * as globalUtils from '../global';
import * as publicUtils from '../public';
import * as resourceUtils from '../resource';
import { buildPastDrawingsDict } from './helpers';
import { buildUsedCardsIdsDict } from '../../utils/helpers';

/**
 * Get expression cards resource based on the game's language
 * @param language
 * @returns
 */
export const getCards = async (language: string) => {
  const resourceName = `arte-ruim-${language}`;
  // Get full deck
  const allCards = await resourceUtils.fetchResource(resourceName);

  const allLevel4 = await resourceUtils.fetchResource(`arte-ruim-extra-${language}`);

  // Get used deck
  const usedCardsId = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.ARTE_RUIM, {});

  return {
    allCards,
    usedCardsId: usedCardsId,
    level4Cards: Object.values(allLevel4),
  };
};

/**
 * Saves past drawings into a public document depending on the language
 * @param pastDrawings
 * @param language
 */
export const saveUsedCards = async (pastDrawings: ArteRuimDrawing[], language: Language) => {
  // Save usedArteRuimCards to global
  const usedArteRuimCards = buildUsedCardsIdsDict(pastDrawings);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.ARTE_RUIM, usedArteRuimCards);
  // Save drawings to public gallery
  const drawingDocumentName = language === 'pt' ? 'arteRuimDrawingsPt' : 'arteRuimDrawingsEn';
  const publicDrawings = await publicUtils.getPublicFirebaseDocData(drawingDocumentName, {});
  const newArteRuimDrawings = buildPastDrawingsDict(pastDrawings, publicDrawings);
  await publicUtils.updatePublicFirebaseDoc(drawingDocumentName, newArteRuimDrawings);
};
