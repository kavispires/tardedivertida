import { useDraggable } from '@dnd-kit/core';
import { motion } from 'motion/react';
import type React from 'react';
import { useEffect, useRef } from 'react';
// Pages
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import type { Piece, Point } from '../utils/types';

type DraggablePieceProps = {
  pieceData: Piece;
  imageUrl: string;
  totalCols: number;
  totalRows: number;
  blockSize: number;
  isLocked?: boolean;
  pieceState: Point & { isLocked: boolean };
};
export const DraggablePiece = ({
  pieceData,
  pieceState,
  imageUrl,
  totalCols,
  totalRows,
  blockSize,
}: DraggablePieceProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: pieceData.id,
    disabled: pieceState.isLocked,
    data: { ...pieceData, ...pieceState }, // Pass combined data for sensors if needed
  });

  const targetScale = pieceState.isLocked ? 1 : isDragging ? 1 : 0.85;
  const zIndex = isDragging ? 9999 : pieceState.isLocked ? 1 : 100;

  // Helper: Derive grid coordinates from index
  const gridX = pieceData.correctPos % totalCols;
  const gridY = Math.floor(pieceData.correctPos / totalCols);

  const wasDraggingRef = useRef(false);

  useEffect(() => {
    if (isDragging && !wasDraggingRef.current) {
      playSFX('bubbleIn');
      wasDraggingRef.current = true;
    } else if (!isDragging) {
      wasDraggingRef.current = false;
    }
  }, [isDragging]);

  const dndStyle: React.CSSProperties = {
    left: pieceState.x,
    top: pieceState.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex,
    cursor: pieceState.isLocked ? 'default' : 'grab',
  };

  return (
    <div className="vitrais-piece-dnd" ref={setNodeRef} style={dndStyle} {...listeners} {...attributes}>
      <motion.div
        className="vitrais-piece"
        animate={{
          scale: targetScale,
          opacity: 1,
          filter: pieceState.isLocked ? 'brightness(1)' : isDragging ? 'brightness(1.1)' : 'brightness(1)',
          boxShadow: pieceState.isLocked ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        }}
        transition={{
          duration: 0.4,
          type: 'spring',
          stiffness: 250,
          damping: 25,
        }}
        whileHover={!pieceState.isLocked && !isDragging ? { scale: 0.9 } : undefined}
        whileTap={!pieceState.isLocked ? { cursor: 'grabbing' } : undefined}
      >
        {pieceData.shape.map((block, i) => {
          // pieceData.gridX/gridY is the anchor position. block.x/y is relative offset.
          const bgX = -(gridX + block.x) * blockSize;
          const bgY = -(gridY + block.y) * blockSize;

          return (
            <motion.div
              className="vitrais-piece-image-block"
              key={i}
              style={{
                left: block.x * blockSize,
                top: block.y * blockSize,
                width: blockSize,
                height: blockSize,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${totalCols * blockSize}px ${totalRows * blockSize}px`,
                backgroundPosition: `${bgX}px ${bgY}px`,
              }}
              animate={{
                border: pieceState.isLocked ? '0px solid transparent' : '1px solid rgba(255,255,255,0.6)',
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};
