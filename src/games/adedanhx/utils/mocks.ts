import { random } from 'lodash';
import { mockClue } from 'mock/clues';
// Types
import type { TopicCard } from 'types/tdr';
// Internal
import { ANSWERING_TIME } from './constants';
import type { Answer, LetterEntry } from './types';

const mockAnswer = (id: string, _topic: TopicCard, letter: LetterEntry, correct?: boolean): Answer => {
  // 50% chance of answering
  const answerChance = correct || Math.random() > 0.5;

  if (answerChance) {
    // 90% chance of correct answer
    const correctChance = Math.random() > 0.1;

    if (!correctChance) {
      return {
        id,
        answer: `ç${mockClue()}ç`,
        timestamp: random(30, Math.max(ANSWERING_TIME, 45)),
      };
    }

    let answer = mockClue();
    if (letter.type === 'starts-with') {
      answer = `${letter.letters}${answer}`;
    }
    if (letter.type === 'ends-with') {
      answer = `${answer}${letter.letters}`;
    }
    if (letter.type === 'includes') {
      const index = random(0, answer.length - 1);
      answer = `${answer.slice(0, index)}${letter.letters}${answer.slice(index)}`;
    }

    return {
      id,
      answer,
      timestamp: random(1, 180),
    };
  }

  return {
    id,
    answer: '',
    timestamp: 0,
  };
};

export const mockAnswers = (
  answers: Record<string, Answer>,
  topics: TopicCard[],
  letters: LetterEntry[],
  stop?: boolean,
) => {
  const copy = { ...answers };
  Object.keys(copy).forEach((id) => {
    const [x, y] = id.split('-').map(Number);
    const topic = topics[x];
    const letter = letters[y];
    const answer = mockAnswer(id, topic, letter, stop);
    if (answer) {
      copy[id] = answer;
    }
  });
  return copy;
};
