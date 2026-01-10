import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
// Internal
import { COLS, getPieceStyle } from '../utils/puzzleUtils';
// Ant Design Resources
// Hooks
// Icons
// Components

type DraggablePieceProps = {
  pieceId: number;
  currentSlotIndex: number;
  totalRows: number;
  imageUrl: string | undefined;
  isHidden?: boolean;
  disabled?: boolean;
  isJustDropped?: boolean; // New prop to control animation
  borders?: { top: boolean; right: boolean; bottom: boolean; left: boolean };
};

export const DraggablePiece = ({
  pieceId,
  currentSlotIndex,
  totalRows,
  imageUrl,
  isHidden,
  disabled,
  isJustDropped,
  borders = { top: true, right: true, bottom: true, left: true },
}: DraggablePieceProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `piece-${pieceId}`,
    data: { piece: { id: pieceId }, originIndex: currentSlotIndex },
    disabled: disabled,
  });

  const col = currentSlotIndex % COLS;
  const row = Math.floor(currentSlotIndex / COLS);
  const left = `${col * (100 / COLS)}%`;
  const top = `${row * (100 / totalRows)}%`;
  const width = `${100 / COLS}%`;
  const height = `${100 / totalRows}%`;

  const borderStyle = '0.5px solid rgba(0,0,0,0.5)';

  // Conditional transition:
  // If it was just dropped, snap instantly (duration 0).
  // Otherwise, use the spring animation for smooth swapping.
  const transition = isJustDropped
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 350, damping: 25 };

  return (
    <motion.div
      ref={setNodeRef}
      initial={false}
      animate={{ top, left }}
      transition={transition}
      style={{
        position: 'absolute',
        width,
        height,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : 10,
        opacity: isHidden ? 0 : 1,
        touchAction: 'none',
        cursor: disabled ? 'default' : 'grab',
      }}
      {...listeners}
      {...attributes}
    >
      <div style={getPieceStyle(pieceId, imageUrl, totalRows)} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderTop: borders.top ? borderStyle : 'none',
          borderRight: borders.right ? borderStyle : 'none',
          borderBottom: borders.bottom ? borderStyle : 'none',
          borderLeft: borders.left ? borderStyle : 'none',
        }}
      />
    </motion.div>
  );
};
