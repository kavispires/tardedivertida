import { sample } from 'lodash';
// Internal
import type { Question } from './types';

export function mockQuestionSelection(questions: Question[]) {
  return sample(questions)?.id || questions[0].id;
}

export function mockWitnessTestimony() {
  return Math.random() < 0.5;
}
