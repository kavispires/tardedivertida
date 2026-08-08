import { sample } from 'lodash';
// Types
import type { TestimonyStatementCardData } from 'types/tdr';

export function mockQuestionSelection(questions: TestimonyStatementCardData[]) {
  return sample(questions)?.id || questions[0].id;
}

export function mockWitnessTestimony() {
  return Math.random() < 0.5;
}
