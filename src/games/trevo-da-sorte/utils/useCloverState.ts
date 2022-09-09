import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { onRotate } from './helpers';

export function useCloverState(
  mode: CloverMode,
  clover: Clover,
  leaves: Leaves,
  updateCloverState?: GenericFunction
) {
  // console.log({ mode, clover, leaves });
  const [clues, setClues] = useState<string[]>(['', '', '', '']);
  const [rotation, setRotation] = useState<number>(clover.rotation);
  const [guesses, setGuesses] = useState<YGuesses>({ A: null, B: null, C: null, D: null });
  const [allowLeafRotation, setAllowLeafRotation] = useState(true);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);
  const [activeSlotId, setActiveSlotId] = useState<LeafPosition | null>(null);

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

    if (mode === 'guess' || mode === 'wait') {
      setAllowLeafRotation(true);
      setClues(clover.clues!);
    }
  });

  // useEffect(() => {
  //   if (mode === 'guess') {

  //   }
  // }, [])

  const [rotations, setRotations] = useState<NumberDictionary>(
    Object.keys(leaves).reduce((acc: NumberDictionary, leafId) => {
      acc[leafId] = 0;
      return acc;
    }, {})
  );

  const onRotateLeaf = (e: any, leadId: LeafId) => {
    e.stopPropagation();
    const newRotation = onRotate(rotations[leadId]);
    setRotations((prevState) => ({ ...prevState, [leadId]: newRotation }));

    setActiveLeafId(null);
    setActiveSlotId(null);
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

  const onActivateLeaf = (targetLeafId: LeafId) => {
    if (activeLeafId === targetLeafId) {
      return setActiveLeafId(null);
    }

    // Attach leaf to slot
    // TODO: if duplicated leaf, remove
    if (activeSlotId) {
      setGuesses((g) => {
        const repeat = Object.keys(g).filter((k) => {
          const key = k as LeafPosition;
          const l = g[key];
          return l?.leafId === targetLeafId;
        });

        const newGuesses = {
          ...g,
          [activeSlotId]: {
            leafId: targetLeafId,
            rotation: rotations[targetLeafId],
          },
        };

        if (repeat.length > 0) {
          const key = repeat[0] as LeafPosition;
          newGuesses[key] = null;
        }

        return newGuesses;
      });

      setActiveSlotId(null);
    } else {
      setActiveLeafId(targetLeafId);
    }
  };

  const onActivateSlot = (targetSlotId: LeafPosition) => {
    // If it's the same slot, deactivate it
    if (activeSlotId === targetSlotId) {
      return setActiveSlotId(null);
    }

    // If slot and slot, swap their leaves
    if (activeSlotId && activeSlotId !== targetSlotId) {
      setGuesses((g) => {
        const activeContent = g[activeSlotId];
        const targetContent = g[targetSlotId];

        return {
          ...g,
          [activeSlotId]: targetContent,
          [targetSlotId]: activeContent,
        };
      });

      setActiveSlotId(null);
      return;
    }

    // Attach slot to leaf
    // TODO: if duplicated leaf, remove
    if (activeLeafId) {
      setGuesses((g) => {
        const repeat = Object.keys(g).filter((k) => {
          const key = k as LeafPosition;
          const l = g[key];
          return l?.leafId === activeLeafId;
        });

        const newGuesses = {
          ...g,
          [targetSlotId]: {
            leafId: activeLeafId,
            rotation: rotations[activeLeafId],
          },
        };

        if (repeat.length > 0) {
          const key = repeat[0] as LeafPosition;
          newGuesses[key] = null;
        }

        return newGuesses;
      });

      setActiveLeafId(null);
    } else {
      setActiveSlotId(targetSlotId);
    }
  };

  const isCluesComplete = clues.every((clue) => clue.trim());
  console.log({ activeLeafId, activeSlotId });
  console.log({ guesses });

  return {
    mode,
    onRotateClover,
    rotation,
    onRotateLeaf,
    rotations,
    onChangeClue,
    clues,
    onActivateLeaf,
    activeLeafId,
    onActivateSlot,
    activeSlotId,
    guesses,
    allowLeafRotation,
    isCluesComplete,
  };
}
