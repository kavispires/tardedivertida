// Resources
import ueSoIssoWordsPt from '../../resources/ue-so-isso-pt.json';
import ueSoIssoWordsEn from '../../resources/ue-so-isso-en.json';

export const getWords = async (language: string) => {
  // Get list of words
  return language === 'en' ? ueSoIssoWordsEn : ueSoIssoWordsPt;
};
