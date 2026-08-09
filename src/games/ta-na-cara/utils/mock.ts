import { sample } from 'lodash';
// Internal
import type { SubmitAnswerPayload } from './types';

export function mockAnswer() {
  return sample([-2, -2, -1, 1, 2, 2]) as SubmitAnswerPayload['answer'];
}
