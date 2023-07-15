import { sampleSize } from 'lodash';
import { getAvailableSegments } from './helpers';
import { getRandomItem } from 'utils/helpers';

export const mockNewMap = (hand: ExtendedTextCard): ExtendedTextCard[] => {
  return sampleSize<ExtendedTextCard>(hand, 3).map((card) => ({
    ...card,
    negate: Math.random() > 0.75,
  }));
};

export const mockFollowedPath = (
  fullMap: MapSegment[],
  currentMap: MapSegment[],
  increaseChances: boolean = false
) => {
  const usedTrees = fullMap
    .filter((segment: MapSegment) => segment.passed)
    .map((segment: MapSegment) => segment.treeId);

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
