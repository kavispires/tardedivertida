// Helpers
import * as globalUtils from '../global';
// Resources
import testemunhaOcularCardsPt from '../../resources/testemunha-ocular-pt.json';
import testemunhaOcularCardsEn from '../../resources/testemunha-ocular-en.json';

export const getCards = async (language: string) => {
  // Get full deck
  const allCards = language === 'en' ? testemunhaOcularCardsEn : testemunhaOcularCardsPt;
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData('usedTestemunhaOcularCards', {});
  return {
    allCards,
    usedCards: Object.keys(usedCards),
  };
};
