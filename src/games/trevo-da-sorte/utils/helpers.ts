// Internal
import { DIRECTIONS_INDEXES, LEAVES_ORDER } from './constants';
import type { CloverObject, CloverLeaf, LeafPosition, Guesses, Leaves } from './types';

export const onRotate = (value: number, direction = 1) => {
  return value + 90 * direction;
};

export const parseRotation = (value: number) => {
  return value % 360;
};

export const prepareClueSubmission = (
  clues: string[],
  clover: CloverObject,
  rotations: NumberDictionary,
): CloverLeaf[] => {
  return LEAVES_ORDER.map((position, index) => {
    const leafId = clover.leaves[position as LeafPosition].leafId;
    return {
      leafId,
      clue: clues[index],
      rotation: rotations[leafId],
    };
  });
};

export const cleanupGuesses = (guesses: Guesses) => {
  Object.values(guesses).forEach((guess) => {
    if (guess?.rotation) {
      guess.rotation = parseRotation(guess.rotation);
    }
  });

  return guesses;
};

export const getWord = (
  clover: CloverObject,
  leaves: Leaves,
  rotations: NumberDictionary,
  position: LeafPosition,
  direction: keyof typeof DIRECTIONS_INDEXES,
): string => {
  const leaf = leaves[clover.leaves[position].leafId];
  const rotation = parseRotation(rotations[leaf.id]);
  const words = [...leaf.cards, ...leaf.cards];
  const initialIndexBasedOnRotation = [0, 270, 180, 90].indexOf(rotation);
  return words[initialIndexBasedOnRotation + DIRECTIONS_INDEXES[direction]].text;
};
