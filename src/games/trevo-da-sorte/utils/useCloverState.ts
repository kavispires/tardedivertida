import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { onRotate } from './helpers';

export function useCloverState(mode: CloverMode, clover: Clover, leaves: Leaves) {
  const [clues, setClues] = useState<string[]>(clover.clues ?? ['', '', '', '']);
  const [rotation, setRotation] = useState<number>(clover.rotation);
  const [guesses, setGuesses] = useState<YGuesses>({ A: null, B: null, C: null, D: null });
  const [allowLeafRotation, setAllowLeafRotation] = useState(true);

  useEffectOnce(() => {
    if (mode === 'write') {
      setAllowLeafRotation(false);

      const writeGuesses = Object.entries(clover.leaves).reduce(
        (acc: YGuesses, [key, leafId]) => {
          const guess: LeafGuess = {
            leafId,
            rotation: leaves[leafId].rotation,
          };
          acc[key as LeafPosition] = guess;
          return acc;
        },
        { A: null, B: null, C: null, D: null }
      );
      setGuesses(writeGuesses);
    }
    console.log({ mode });
    if (mode === 'guess') {
      setAllowLeafRotation(true);
      setClues(clover.clues!);
    }
  });

  const [rotations, setRotations] = useState<NumberDictionary>({
    // A: clover.leaves[0].rotation,
    // B: clover.leaves[1].rotation,
    // C: clover.leaves[2].rotation,
    // D: clover.leaves[3].rotation,
  });

  const onRotateLeaf = (leaf: LeafIndex) => {
    setRotations((prevState) => ({ ...prevState, [leaf]: onRotate(rotations[leaf]) }));
  };

  const onRotateClover = (direction: number) => {
    setRotation(onRotate(rotation, direction));
  };

  const onChangeClue = (targetIndex: LeafIndex, value: string) => {
    setClues((prevState) => {
      const copy = [...prevState];
      copy[targetIndex] = value;
      return copy;
    });
  };

  const isCluesComplete = clues.every((clue) => clue.trim());

  return {
    rotation,
    rotations,
    onRotateLeaf,
    onRotateClover,
    onChangeClue,
    clues,
    guesses,
    allowLeafRotation,
    isCluesComplete,
  };
}
