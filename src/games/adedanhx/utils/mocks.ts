import { random } from 'lodash';
import { mockClue } from 'mock/clues';

const mockAnswer = (id: string, topic: TopicCard, letter: LetterEntry): Answer => {
  // 60% chance of answering
  const answerChance = Math.random() > 0.4;

  if (answerChance) {
    // 90% chance of correct answer
    const correctChance = Math.random() > 0.1;

    if (!correctChance) {
      return {
        id,
        answer: `ç${mockClue()}ç`,
        timestamp: random(30, 180),
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

export const mockAnswers = (answers: Record<string, Answer>, topics: TopicCard[], letters: LetterEntry[]) => {
  const copy = { ...answers };
  Object.keys(copy).forEach((id) => {
    const [x, y] = id.split('-').map(Number);
    const topic = topics[x];
    const letter = letters[y];
    answers[id] = mockAnswer(id, topic, letter);
  });
  return answers;
};
