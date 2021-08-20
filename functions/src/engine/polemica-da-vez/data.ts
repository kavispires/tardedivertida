// Resources
import polemicaDaVezTopicsPt from '../../resources/polemica-da-vez-pt.json';
import polemicaDaVezTopicsEn from '../../resources/polemica-da-vez-en.json';

export const getTopics = async (language: string) => {
  // Get full deck
  const allTopics = language === 'en' ? polemicaDaVezTopicsEn : polemicaDaVezTopicsPt;

  return {
    allTopics,
  };
};
