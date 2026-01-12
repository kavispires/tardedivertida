import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import type React from 'react';
import { useEffect, useState, useMemo } from 'react';
// Ant Design Resources
import { Button, Flex, Layout } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useTDImageCardUrl } from 'hooks/useTDImageCardUrl';
// Icons
import { AnimatedProcessingIcon } from 'icons/collection';
// Components
import { DualTranslate } from 'components/language';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { Header } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';

// --- Types ---

export type DailyVitraisEntryV2 = {
  id: string;
  number: number;
  type: 'vitrais';
  title: string;
  cardId: string;
  pieces: number[];
};

type PieceData = {
  id: number;
};

type GridState = (PieceData | null)[];

// --- Constants ---

const COLS = 3;

// --- Helpers ---

const getPieceStyle = (
  pieceId: number,
  imageUrl: string | undefined,
  totalRows: number,
): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#2d2d2d',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  if (!imageUrl) return baseStyle;

  const col = pieceId % COLS;
  const row = Math.floor(pieceId / COLS);
  const yOffset = totalRows > 1 ? row * (100 / (totalRows - 1)) : 0;

  return {
    ...baseStyle,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${COLS * 100}% ${totalRows * 100}%`,
    backgroundPosition: `${col * (100 / (COLS - 1))}% ${yOffset}%`,
  };
};

const arePiecesConnectable = (idA: number, idB: number, isHorizontal: boolean) => {
  if (isHorizontal) {
    return idB === idA + 1 && Math.floor(idA / COLS) === Math.floor(idB / COLS);
  }
  return idB === idA + COLS;
};

// --- Sub-Components ---

const GridSlot = ({ index }: { index: number }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { index },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid rgba(255,255,255,0.05)',
          backgroundColor: isOver ? 'rgba(255,255,255,0.1)' : 'transparent',
        }}
      />
    </div>
  );
};

interface DraggablePieceProps {
  pieceId: number;
  currentSlotIndex: number;
  totalRows: number;
  imageUrl: string | undefined;
  isHidden?: boolean;
  disabled?: boolean;
  isJustDropped?: boolean; // New prop to control animation
  borders?: { top: boolean; right: boolean; bottom: boolean; left: boolean };
}

const DraggablePiece = ({
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

// --- Main Game Component ---

interface VitraisPuzzleProps {
  data: DailyVitraisEntryV2;
  width: number;
  onSaveProgress?: (pieceOrder: number[]) => void;
}

export const VitraisPuzzle: React.FC<VitraisPuzzleProps> = ({ data, onSaveProgress, width }) => {
  const imageUrl = useTDImageCardUrl(data.cardId);
  const queryClient = useQueryClient();

  const totalSlots = data.pieces ? data.pieces.length : 0;
  const rows = Math.max(1, Math.ceil(totalSlots / COLS));

  const safeWidth = width > 0 ? width : 300;
  const totalHeight = safeWidth * 1.5;
  const cellWidth = safeWidth / COLS;
  const cellHeight = totalHeight / rows;

  const [grid, setGrid] = useState<GridState>([]);
  // Store the IDs of pieces that were just dropped to skip their animation
  const [justDroppedIds, setJustDroppedIds] = useState<number[]>([]);

  const allPieceIds = useMemo(() => {
    if (!data.pieces) return [];
    return Array.from({ length: data.pieces.length }, (_, i) => i);
  }, [data.pieces]);

  const [activeDrag, setActiveDrag] = useState<{
    pieceId: number;
    originIndex: number;
    groupIndices: number[];
  } | null>(null);

  useEffect(() => {
    if (data.pieces && data.pieces.length > 0) {
      const newGrid = data.pieces.map((id) => ({ id }));
      setGrid(newGrid);
    }
  }, [data.pieces]);

  useEffect(() => {
    if (grid.length === 0) return;
    const currentOrder = grid.map((p) => (p ? p.id : -1));
    onSaveProgress?.(currentOrder);
  }, [grid, onSaveProgress]);

  const isSolved = useMemo(() => {
    if (grid.length === 0) return false;
    return grid.every((piece, index) => piece && piece.id === index);
  }, [grid]);

  // --- Group Logic ---

  const getConnectedGroupIndices = (gridState: GridState, startIndex: number): number[] => {
    const startPiece = gridState[startIndex];
    if (!startPiece) return [];

    const group = new Set<number>();
    const queue = [startIndex];
    group.add(startIndex);

    while (queue.length > 0) {
      const currentIdx = queue.shift();
      if (currentIdx === undefined) continue;
      const currentPiece = gridState[currentIdx];
      if (!currentPiece) continue;

      const neighbors = [
        { idx: currentIdx - 1, dir: 'horizontal' },
        { idx: currentIdx + 1, dir: 'horizontal' },
        { idx: currentIdx - COLS, dir: 'vertical' },
        { idx: currentIdx + COLS, dir: 'vertical' },
      ];

      for (const { idx, dir } of neighbors) {
        if (idx < 0 || idx >= totalSlots) continue;

        if (dir === 'horizontal') {
          const currentRow = Math.floor(currentIdx / COLS);
          const neighborRow = Math.floor(idx / COLS);
          if (currentRow !== neighborRow) continue;
        }

        if (group.has(idx)) continue;

        const neighborPiece = gridState[idx];
        if (neighborPiece) {
          let connected = false;
          if (dir === 'horizontal') {
            if (idx > currentIdx) connected = arePiecesConnectable(currentPiece.id, neighborPiece.id, true);
            else connected = arePiecesConnectable(neighborPiece.id, currentPiece.id, true);
          } else {
            if (idx > currentIdx) connected = arePiecesConnectable(currentPiece.id, neighborPiece.id, false);
            else connected = arePiecesConnectable(neighborPiece.id, currentPiece.id, false);
          }

          if (connected) {
            group.add(idx);
            queue.push(idx);
          }
        }
      }
    }
    return Array.from(group).sort((a, b) => a - b);
  };

  const getBorders = (index: number, currentGrid: GridState) => {
    const piece = currentGrid[index];
    if (!piece) return { top: true, right: true, bottom: true, left: true };

    const checkConnection = (neighborIdx: number, dir: 'horizontal' | 'vertical') => {
      if (neighborIdx < 0 || neighborIdx >= totalSlots) return false;
      const neighbor = currentGrid[neighborIdx];
      if (!neighbor) return false;

      if (dir === 'horizontal') {
        return (
          arePiecesConnectable(piece.id, neighbor.id, true) ||
          arePiecesConnectable(neighbor.id, piece.id, true)
        );
      }
      return (
        arePiecesConnectable(piece.id, neighbor.id, false) ||
        arePiecesConnectable(neighbor.id, piece.id, false)
      );
    };

    const topIdx = index - COLS;
    const bottomIdx = index + COLS;
    const leftIdx = index - 1;
    const rightIdx = index + 1;

    const hasTop = topIdx >= 0 && checkConnection(topIdx, 'vertical');
    const hasBottom = bottomIdx < totalSlots && checkConnection(bottomIdx, 'vertical');
    const hasLeft = index % COLS !== 0 && checkConnection(leftIdx, 'horizontal');
    const hasRight = index % COLS !== 2 && checkConnection(rightIdx, 'horizontal');

    return { top: !hasTop, right: !hasRight, bottom: !hasBottom, left: !hasLeft };
  };

  // --- DND Handlers ---

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      // Changed delay to 0 for instant response
      // Kept tolerance: 5 to allow a tiny bit of finger slip before dragging starts (prevents accidental clicks)
      activationConstraint: { delay: 10, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (isSolved) return;
    const { active } = event;
    const { piece, originIndex } = active.data.current as { piece: PieceData; originIndex: number };
    const groupIndices = getConnectedGroupIndices(grid, originIndex);
    const relativeGroup = groupIndices.map((idx) => idx - originIndex);
    setActiveDrag({ pieceId: piece.id, originIndex, groupIndices: relativeGroup });
    // Clear any previous drop animation flags
    setJustDroppedIds([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    const dragData = activeDrag;
    setActiveDrag(null);

    if (!over || !dragData || isSolved) return;

    const targetAnchorIndex = over.data.current?.index as number;
    const sourceAnchorIndex = dragData.originIndex;

    if (targetAnchorIndex === sourceAnchorIndex) return;

    const sourceIndices = dragData.groupIndices.map((offset) => sourceAnchorIndex + offset);
    const targetIndices = dragData.groupIndices.map((offset) => targetAnchorIndex + offset);

    const isValidMove = targetIndices.every((idx) => idx >= 0 && idx < totalSlots);
    if (!isValidMove) return;

    // 1. Identify which pieces are being "dropped" by the user
    const draggedPieceIds = sourceIndices
      .map((idx) => grid[idx]?.id)
      .filter((id) => id !== undefined) as number[];
    setJustDroppedIds(draggedPieceIds);

    // 2. Perform the swap
    setGrid((prev) => {
      const next = [...prev];
      const sourceSet = new Set(sourceIndices);
      const targetSet = new Set(targetIndices);

      const displacedValues = targetIndices.filter((idx) => !sourceSet.has(idx)).map((idx) => prev[idx]);

      const vacatedSlots = sourceIndices.filter((idx) => !targetSet.has(idx));

      vacatedSlots.forEach((slotIndex, i) => {
        if (i < displacedValues.length) {
          next[slotIndex] = displacedValues[i];
        }
      });

      targetIndices.forEach((targetIdx, i) => {
        const sourceIdx = sourceIndices[i];
        next[targetIdx] = prev[sourceIdx];
      });

      return next;
    });

    // 3. Clear the "just dropped" flag after a short delay so future auto-moves animate
    setTimeout(() => {
      setJustDroppedIds([]);
    }, 250);
  };

  // --- Rendering ---

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: safeWidth,
        margin: '12px auto',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: safeWidth,
          height: totalHeight,
          backgroundColor: '#1f1f1f',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          border: isSolved ? '2px solid #4ade80' : 'none',
          transition: 'border 0.3s ease',
        }}
      >
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            style={{
              display: 'grid',
              width: '100%',
              height: '100%',
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: totalSlots }).map((_, index) => (
              <GridSlot
                key={index}
                index={index}
              />
            ))}
          </div>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
            {allPieceIds.map((pieceId) => {
              const currentSlotIndex = grid.findIndex((p) => p?.id === pieceId);
              if (currentSlotIndex === -1) return null;

              let isHidden = false;
              if (activeDrag) {
                const offset = currentSlotIndex - activeDrag.originIndex;
                if (activeDrag.groupIndices.includes(offset)) {
                  isHidden = true;
                }
              }

              const borders = getBorders(currentSlotIndex, grid);
              const isJustDropped = justDroppedIds.includes(pieceId);

              return (
                <DraggablePiece
                  key={pieceId}
                  pieceId={pieceId}
                  currentSlotIndex={currentSlotIndex}
                  totalRows={rows}
                  imageUrl={imageUrl}
                  isHidden={isHidden}
                  disabled={isSolved}
                  borders={borders}
                  isJustDropped={isJustDropped}
                />
              );
            })}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeDrag ? (
              <div style={{ position: 'relative', width: cellWidth, height: cellHeight }}>
                {activeDrag.groupIndices.map((offset) => {
                  const originalIndex = activeDrag.originIndex + offset;
                  const piece = grid[originalIndex];
                  if (!piece) return null;

                  const colOffset = (originalIndex % COLS) - (activeDrag.originIndex % COLS);
                  const rowOffset =
                    Math.floor(originalIndex / COLS) - Math.floor(activeDrag.originIndex / COLS);

                  const borders = getBorders(originalIndex, grid);

                  return (
                    <div
                      key={piece.id}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: `${colOffset * 100}%`,
                        top: `${rowOffset * 100}%`,
                        zIndex: 999,
                        filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.5))',
                      }}
                    >
                      <div style={getPieceStyle(piece.id, imageUrl, rows)} />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          pointerEvents: 'none',
                          borderTop: borders.top ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                          borderRight: borders.right ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                          borderBottom: borders.bottom ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                          borderLeft: borders.left ? '0.5px solid rgba(255,255,255,0.8)' : 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isSolved && (
        <div style={{ marginTop: '1rem', color: '#4ade80', fontWeight: 'bold' }}>Puzzle Completed!</div>
      )}

      <Flex
        justify="center"
        className="mt-6"
      >
        <Button
          onClick={() =>
            queryClient.refetchQueries({
              queryKey: ['demo-vitrais'],
            })
          }
        >
          Outra imagem
        </Button>
      </Flex>
    </div>
  );
};

type DailyDemoProps = {
  data: DailyVitraisEntryV2;
};

export function DailyDemoContent({ data }: DailyDemoProps) {
  const [width, ref] = useCardWidthByContainerRef(1, {
    margin: 72,
    gap: 0,
    maxWidth: 512,
    minWidth: 256,
  });
  return (
    <Layout className="app">
      <Header
        icon={<AnimatedProcessingIcon />}
        localStorageKey=""
      >
        TD <DualTranslate>{{ en: 'Demo', pt: 'Demonstração' }}</DualTranslate> #{data.number}
      </Header>
      <DailyContent ref={ref}>
        <Menu
          hearts={0}
          total={5}
          openRules={true}
          rules={
            <>Não escrevi regras, estou testando alguma coisa que pedi pra vc testar também. Adivinhe!</>
          }
        />

        <VitraisPuzzle
          data={data}
          width={width}
        />
      </DailyContent>
    </Layout>
  );
}
