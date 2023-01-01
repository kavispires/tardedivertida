import { useEffect, useState } from 'react';
// Ant Design Resources
import { notification } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Helpers
import { onRotate, parseRotation } from './helpers';
import { FIRST_ATTEMPT_SCORE, SECOND_ATTEMPT_SCORE } from './constants';
import { getRandomItem } from 'utils/helpers';

/**
 * Keeps track of the clover state
 * @param mode
 * @param clover
 * @param leaves
 * @param onSubmit
 * @returns
 */
export function useCloverState(mode: CloverMode, clover: Clover, leaves: Leaves, onSubmit?: GenericFunction) {
  const { translate } = useLanguage();
  const [attempts, setAttempts] = useState(0);
  const [clues, setClues] = useState<string[]>(['', '', '', '']);
  const [rotation, setRotation] = useState<number>(0);
  const [activeLeafId, setActiveLeafId] = useState<string | null>(null);
  const [activeSlotId, setActiveSlotId] = useState<LeafPosition | null>(null);
  const [guesses, setGuesses] = useState<YGuesses>({ A: null, B: null, C: null, D: null });
  const [locks, setLocks] = useState<LeafLocks>({ A: false, B: false, C: false, D: false });
  const [rotations, setRotations] = useState<NumberDictionary>(
    Object.keys(leaves).reduce((acc: NumberDictionary, leafId) => {
      acc[leafId] = 0;
      return acc;
    }, {})
  );
  const [usedLeavesIds, setUsedLeavesIds] = useState<string[]>([]);

  // Keep used leaves ids up to date
  useEffect(() => {
    setUsedLeavesIds(Object.values(guesses).map((guess) => guess?.leafId ?? ''));
  }, [guesses]);

  // Keep guess rotation up to date
  useEffect(() => {
    setGuesses((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((k) => {
        const key = k as LeafPosition;
        const entry = newState[key];
        if (entry) {
          entry.rotation = rotations[entry.leafId];
        }
      });
      return newState;
    });
  }, [rotations]);

  /**
   * Handles clover local rotation
   * @param direction
   */
  const onRotateClover = (direction: number) => {
    setRotation(onRotate(rotation, direction));
  };

  /**
   * Updates the clue according to its index
   * @param targetIndex
   * @param value
   */
  const onClueChange = (targetIndex: LeafIndex, value: string) => {
    setClues((prevState) => {
      const copy = [...prevState];
      copy[targetIndex] = value;
      return copy;
    });
  };

  /**
   * Rotates a leaf
   * @param e
   * @param leadId
   * @param quantity - how many times it should rotate
   */
  const onLeafRotate = (e: ButtonEvent, leadId: LeafId, quantity = 1) => {
    e.stopPropagation();
    const newRotation = onRotate(rotations[leadId], quantity);
    setRotations((prevState) => ({ ...prevState, [leadId]: newRotation }));

    setActiveLeafId(null);
    setActiveSlotId(null);
  };

  /**
   * Randomly chooses different rotations for the leaves
   */
  const onRandomizeLeafRotations = (e: any) => {
    Object.values(clover.leaves).forEach((cloverLeaf) => {
      onLeafRotate(e, cloverLeaf.leafId, getRandomItem([1, 2, 3, 4, 5]));
    });
  };

  /**
   * Removes the leaf of the clover
   * @param targetSlotId
   */
  const onLeafRemove = (targetSlotId: LeafPosition) => {
    setGuesses((prevState) => ({ ...prevState, [targetSlotId]: null }));
  };

  /**
   * Activate a leaf to be connected to the clover
   * @param targetLeafId
   * @returns
   */
  const onActivateLeaf = (targetLeafId: LeafId) => {
    if (activeLeafId === targetLeafId) {
      return setActiveLeafId(null);
    }

    // Attach leaf to slot
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

  /**
   * Activate a slot to receive a leaf on the clover
   * @param targetSlotId
   * @returns
   */
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

  /**
   * First attempt: Validates clover, if correct submits, else undo wrong leaves
   * Second attempt: Validates clover, but submits anyway
   */
  const submitClover = () => {
    let correctCount = 0;

    // Verify corrects guesses
    const locksCopy = { ...locks };
    const guessesCopy = { ...guesses };
    Object.keys(guessesCopy).forEach((k) => {
      const key = k as LeafPosition;
      const entry = guessesCopy[key];

      if (entry && (entry.score === undefined || entry.score === 0)) {
        const correctLeaf = clover.leaves[key];
        const isCorrect =
          entry.leafId === correctLeaf.leafId && parseRotation(entry.rotation) === correctLeaf.rotation;

        if (isCorrect) {
          entry.score = attempts === 0 ? FIRST_ATTEMPT_SCORE : SECOND_ATTEMPT_SCORE;
          correctCount += 1;
          locksCopy[key] = true;
        } else if (attempts === 0) {
          guessesCopy[key] = null;
        }

        entry.tries = attempts + 1;
        entry.score = entry.score ?? 0;
      }
    });

    // If correct or second attempt, submit
    if ((correctCount === 4 || attempts === 1) && onSubmit) {
      onSubmit({
        activeCloverId: clover.cloverId,
        guesses: guessesCopy,
      });
      return;
    }

    notification.warning({
      message: translate(`${4 - correctCount} folhas estão erradas`, `${4 - correctCount} leaves are wrong`),
      description: translate(
        'Tente novamente. Pode ter sido folha errada ou rotação errada',
        'Try again. It may have been wrong leaf or just wrong rotation'
      ),
    });

    setGuesses(guessesCopy);
    setLocks(locksCopy);
    setAttempts(1);
  };

  // BOOLEANS
  const areCluesComplete = clues.every((clue) => clue.trim());
  const isCloverComplete = Object.values(guesses).every((guess) => Boolean(guess));

  return {
    mode,
    rotation,
    onRotateClover,
    clues,
    onClueChange,
    rotations,
    onLeafRotate,
    onRandomizeLeafRotations,
    guesses,
    onActivateLeaf,
    activeLeafId,
    onActivateSlot,
    activeSlotId,
    usedLeavesIds,
    onLeafRemove,
    areCluesComplete,
    isCloverComplete,
    submitClover,
    locks,
  };
}
