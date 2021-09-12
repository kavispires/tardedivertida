// Resources
import sonhosPesadelosCardsPt from '../../resources/sonho-pesadelo-pt.json';
import sonhosPesadelosCardsEn from '../../resources/sonho-pesadelo-en.json';

export const getCards = async (language: string) => {
  // Get full deck
  return language === 'en' ? sonhosPesadelosCardsEn : sonhosPesadelosCardsPt;
};
