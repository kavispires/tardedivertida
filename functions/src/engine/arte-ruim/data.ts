// Helpers
import * as globalUtils from '../global';
// Resources
import arteRuimCardsPt from '../../resources/arte-ruim-pt.json';
import arteRuimCardsEn from '../../resources/arte-ruim-en.json';

export const getCards = async (language: string) => {
  // Get full deck
  const allCards = language === 'en' ? arteRuimCardsEn : arteRuimCardsPt;
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData('usedArteRuimCards', {});
  return {
    allCards,
    usedCards: Object.keys(usedCards),
  };
};
