// Types
import type { TestimonyStatementCardData } from 'types/tdr';

export const buildAnswer = (question: TestimonyStatementCardData, testimony: boolean, language: string) => {
  if (language === 'pt') {
    if (testimony) {
      return question.statement;
    }
    if (question.statement.startsWith('Já')) {
      return `nunca ${question.statement.slice(3)}`;
    }
    return `não ${question.statement}`;
  }

  if (language === 'en') {
    if (testimony) {
      return question.statement;
    }
    if (question.statement.includes('ever')) {
      return `have never ${question.statement.slice(5)}`;
    }
    return `does not ${question.statement}`;
  }

  return '';
};
