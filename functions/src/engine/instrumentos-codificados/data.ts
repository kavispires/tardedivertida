// Resources
import themeCardsPt from '../../resources/themes-pt.json';
import themeCardsEn from '../../resources/themes-en.json';

export const getCards = async (language: string) => {
  // Get full deck
  return language === 'en' ? themeCardsEn : themeCardsPt;
};
