import { LEAVES_ORDER } from './constants';

export const onRotate = (value: number, direction: number = 1) => {
  return value + 90 * direction;
};

export const parseRotation = (value: number) => {
  return value % 360;
};

export const prepareClueSubmission = (
  clues: string[],
  clover: Clover,
  rotations: NumberDictionary
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

export const cleanupGuesses = (guesses: YGuesses) => {
  Object.values(guesses).forEach((guess) => {
    if (guess?.rotation) {
      guess.rotation = parseRotation(guess.rotation);
    }
  });

  return guesses;
};
