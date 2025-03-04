import { sampleSize, union } from 'lodash';
// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import type { ExtendedTextCard, MapSegment, TreeId } from './types';
import { getAvailableSegments } from './helpers';

export const mockNewMap = (hand: ExtendedTextCard): ExtendedTextCard[] => {
  return sampleSize<ExtendedTextCard>(hand, 3).map((card) => ({
    ...card,
    negate: Math.random() > 0.75,
  }));
};

export const mockFollowedPath = (
  fullMap: MapSegment[],
  currentMap: MapSegment[],
  increaseChances = false,
  previousMistakes: TreeId[] = [],
) => {
  const usedTrees = union(
    fullMap.filter((segment: MapSegment) => segment.passed).map((segment: MapSegment) => segment.treeId),
    previousMistakes,
  );

  return currentMap.map((segment) => {
    const possibilities = getAvailableSegments(usedTrees[usedTrees.length - 1], usedTrees);
    const correctTreeId = segment.treeId;
    const choice = increaseChances
      ? getRandomItem([...possibilities, correctTreeId])
      : getRandomItem(possibilities);
    usedTrees.push(choice);
    return choice;
  });
};
