// Types
import type { TestimonyQuestionCard } from 'types/tdr';

export const buildAnswer = (question: TestimonyQuestionCard, testimony: boolean, language: string) => {
  if (language === 'pt') {
    if (testimony) {
      return question.answer;
    }
    if (question.answer.startsWith('Já')) {
      return `nunca ${question.answer.slice(3)}`;
    }
    return `não ${question.answer}`;
  }

  if (language === 'en') {
    if (testimony) {
      return question.answer;
    }
    if (question.question.includes('ever')) {
      return `haver never ${question.answer.slice(5)}`;
    }
    return `does not ${question.answer}`;
  }

  return '';
};
