// Types
import type { TextCard } from 'types/tdr';
// Utils
import { getRandomItem } from 'utils/helpers';

export function mockTweetSelection(currentTweets: TextCard[]) {
  return {
    tweetId: getRandomItem(currentTweets).id,
  };
}

export function mockGuess(playerCount: number) {
  return {
    reaction: getRandomItem([true, false]),
    likesGuess: getRandomItem(
      Array(playerCount + 1)
        .fill(0)
        .map((e, i) => e + i),
    ),
  };
}
