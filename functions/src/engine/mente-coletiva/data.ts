// Helpers
import * as globalUtils from '../global';
// Resources
import menteColetivaQuestionsPt from '../../resources/mente-coletiva-pt.json';
import menteColetivaQuestionsEn from '../../resources/mente-coletiva-en.json';

export const getQuestions = async (language: string) => {
  // Get full deck
  const allQuestions = language === 'en' ? menteColetivaQuestionsEn : menteColetivaQuestionsPt;
  // Get used deck
  const usedQuestions = await globalUtils.getGlobalFirebaseDocData('usedMenteColetivaQuestions', {});
  return {
    allQuestions,
    usedQuestions: Object.keys(usedQuestions),
  };
};
