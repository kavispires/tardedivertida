import { random, sampleSize, shuffle } from 'lodash';
// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import type { SubmitGuessPayload, SubmitMetricsPayload, SubmitPoolPayload } from './types';

export const mockPool = (
  secretCardsOptionsIds: CardId[],
  availablePoolCardsIds: CardId[],
): SubmitPoolPayload => {
  console.log('Mocking pool');
  const secretWordId = getRandomItem(secretCardsOptionsIds);
  return {
    secretWordId,
    poolIds: shuffle([...sampleSize(availablePoolCardsIds, 4), secretWordId]),
  };
};

export const mockMetrics = (): SubmitMetricsPayload => {
  console.log('Mocking metrics');
  return {
    metrics: {
      1: random(0, 6),
      2: random(0, 6),
      3: random(0, 6),
      4: random(0, 6),
      5: random(0, 6),
    },
  };
};

export const mockGuess = (poolIds: CardId[], secretWordId: CardId): SubmitGuessPayload => {
  const doubleGuess = random(0, 100) < 45; // 45% chance of double guess

  const choices = [...poolIds, secretWordId];
  const levels = [1, 2, 2, 3, 3, 3];

  if (!doubleGuess) {
    const level = getRandomItem(levels);
    return {
      guesses: [
        {
          cardId: getRandomItem(choices),
          level: level,
          timestamp: level * 13,
        },
      ],
    };
  }

  const secondChoices = [...poolIds, secretWordId, secretWordId, secretWordId, secretWordId];

  const level = getRandomItem(levels);
  const level2 = level + 2;

  return {
    guesses: [
      {
        cardId: getRandomItem(choices),
        level: level,
        timestamp: level * 13,
      },
      {
        cardId: getRandomItem(secondChoices),
        level: level2,
        timestamp: level2 * 17,
      },
    ],
  };
};
