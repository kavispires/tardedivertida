import { useDraggable, useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { motion } from 'motion/react';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Internal
import type { PalavreadoLetter } from '../utils/types';

type BoardProps = {
  letters: PalavreadoLetter[];
  selection: number | null;
  swap: number[];
  onLetterSelection: (index: number) => void;
  guesses: string[][];
  size: number;
};

export function Board({ letters, onLetterSelection, selection, swap, guesses, size }: BoardProps) {
  return (
    <div
      className="palavreado-board"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {letters.map((letterObj, index) => (
        <DraggableTile
          key={letterObj.id}
          letterObj={letterObj}
          index={index}
          size={size}
          guesses={guesses}
          selection={selection}
          swap={swap}
          onLetterSelection={onLetterSelection}
        />
      ))}
    </div>
  );
}

type DraggableTileProps = {
  letterObj: PalavreadoLetter;
  index: number;
  size: number;
  guesses: string[][];
  selection: number | null;
  swap: number[];
  onLetterSelection: (index: number) => void;
};

function DraggableTile({
  letterObj,
  index,
  size,
  guesses,
  selection,
  swap,
  onLetterSelection,
}: DraggableTileProps) {
  const { id, letter, locked, state } = letterObj;
  const row = Math.floor(index / size);
  const col = index % size;
  const previousWrongPlacement = guesses.some((attempts) => attempts[row][col] === letter) && !locked;

  // The specific drop target for this grid square
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `drop-${id}`,
    data: { index },
    disabled: locked,
  });

  // The draggable component that floats
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `drag-${id}`,
    data: { index },
    disabled: locked,
  });

  const isReceiving = isOver && !isDragging && !locked;

  return (
    <div
      ref={setDroppableRef}
      style={{ width: '4rem', height: '4rem' }} // Keeps the drop zone locked perfectly to the CSS grid size
    >
      <motion.button
        ref={setDraggableRef}
        layout
        layoutId={id}
        type="button"
        {...listeners}
        {...attributes}
        whileTap={!locked ? { scale: 1.1 } : undefined}
        animate={{
          x: transform ? transform.x : 0,
          y: transform ? transform.y : 0,
          scale: isDragging ? 1.2 : 1,
          opacity: isDragging ? 0.95 : 1,
          // Explicitly animate to transparent so Framer Motion NEVER gets the style stuck
          boxShadow: isReceiving
            ? 'inset 0 0 0 3px var(--ant-color-primary, gold)'
            : 'inset 0 0 0 0px transparent',
        }}
        transition={
          isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 400, damping: 25 }
        }
        style={{
          zIndex: isDragging ? 50 : isReceiving ? 40 : 1,
          cursor: locked ? 'not-allowed' : isDragging ? 'grabbing' : 'pointer',
          touchAction: 'none',
        }}
        className={clsx(
          'palavreado-board__tile',
          swap.includes(index) && getAnimationClass('zoomIn', { speed: 'faster' }),
          !locked && selection !== index && 'palavreado-board__tile--button',
          selection === index && 'palavreado-board__tile--selected',
          `palavreado-board__tile--${state}`,
          previousWrongPlacement && 'palavreado-board__tile--place-guessed',
          isDragging && 'palavreado-board__tile--dragging',
        )}
        onClick={() => (!locked ? onLetterSelection(index) : null)}
      >
        {letter}
      </motion.button>
    </div>
  );
}
