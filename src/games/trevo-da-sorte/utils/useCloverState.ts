import { useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { onRotate, parseRotation } from './helpers';

export function useCloverState(
  mode: CloverMode,
  clover: Clover,
  leaves: Leaves,
  updateCloverState?: GenericFunction
) {
  console.log({ mode, clover, leaves });
  const [clues, setClues] = useState<string[]>(['', '', '', '']);
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

    if (mode === 'guess') {
      setAllowLeafRotation(true);
      setClues(clover.clues!);
    }
  });

  // useEffect(() => {
  //   if (mode === 'guess') {

  //   }
  // }, [])

  console.log({ clues });

  const [rotations, setRotations] = useState<NumberDictionary>(
    Object.keys(leaves).reduce((acc: NumberDictionary, leafId) => {
      acc[leafId] = 0;
      return acc;
    }, {})
  );

  const onRotateLeaf = (leadId: LeafId) => {
    const newRotation = onRotate(rotations[leadId]);
    setRotations((prevState) => ({ ...prevState, [leadId]: newRotation }));
    // Todo: update game state in clover
    if (updateCloverState) {
      updateCloverState({
        change: {
          [`leaves.${leadId}.rotation`]: parseRotation(newRotation),
        },
      });
    }
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
    mode,
    rotation,
    rotations,
    onRotateLeaf,
    onRotateClover,
    onChangeClue,
    clues,
    guesses: mode === 'write' ? guesses : clover.guess,
    allowLeafRotation,
    isCluesComplete,
  };
}
