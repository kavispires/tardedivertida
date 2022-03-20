import { getRandomItem } from 'utils/helpers';

export function mockTopicSelection(currentTopics: Topic[]) {
  return {
    topicId: getRandomItem(currentTopics).id,
  };
}

export function mockGuess(playerCount: number) {
  return {
    reaction: getRandomItem([true, false]),
    likesGuess: getRandomItem(
      Array(playerCount + 1)
        .fill(0)
        .map((e, i) => e + i)
    ),
  };
}
