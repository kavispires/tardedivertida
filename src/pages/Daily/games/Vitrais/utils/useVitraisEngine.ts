import {
  type DragStartEvent,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
// Pages
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyGlobalStore } from 'pages/Daily/hooks/useDailyGlobalStore';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { DailyVitraisEntry, GameState, GridState, PieceData, SessionState } from './types';
import { arePiecesConnectable, COLS } from './puzzleUtils';

export function useVitraisEngine(data: DailyVitraisEntry, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);
  const [rulesOpen] = useDailyGlobalStore('rulesOpen');

  const { totalSeconds, seconds, minutes, isRunning, start, pause } = useStopwatch({
    autoStart: true,
    offsetTimestamp: moment(new Date()).add(state.timeElapsed, 'seconds').toDate(),
  });

  const allPieceIds = useMemo(() => {
    if (!data.pieces) return [];
    return Array.from({ length: data.pieces.length }, (_, i) => i);
  }, [data.pieces]);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  // CONDITIONS
  const isWin = state.status === STATUSES.WIN;
  const isLose = state.status === STATUSES.LOSE;
  const isComplete = isWin || isLose;

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: functions should be not part of the useEffect dependencies>
  useEffect(() => {
    if (isRunning) {
      updateState({ timeElapsed: totalSeconds });
    }
  }, [totalSeconds, isRunning]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: functions should be not part of the useEffect dependencies>
  useEffect(() => {
    if (isComplete) {
      pause();
    } else {
      if (rulesOpen) {
        pause();
      } else {
        start();
      }
    }
  }, [isComplete, rulesOpen]);

  // Heart removal timer - removes a heart every 20 seconds
  const lastHeartRemovalRef = useRef<number>(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: functions should be not part of the useEffect dependencies
  useEffect(() => {
    if (isComplete || !isRunning || state.hearts <= 0) return;

    const totalSeconds = minutes * 60 + seconds;
    const intervalsPassed = Math.floor(
      totalSeconds / (SETTINGS.HEART_LOSS_INTERVAL_SECONDS + data.pieces.length),
    );

    if (intervalsPassed > lastHeartRemovalRef.current) {
      lastHeartRemovalRef.current = intervalsPassed;
      updateState({ hearts: Math.max(0, state.hearts - 1) });
    }
  }, [minutes, seconds, isRunning, isComplete]);

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isWin || isLose || isComplete);

  const containerRef = useRef<HTMLDivElement>(null);
  // Layout State
  const [measures, setMeasures] = useState({
    width: 0,
    height: 0,
    cellWidth: 0,
    cellHeight: 0,
    rows: 0,
    totalSlots: 0,
  });

  const { session, setSession } = useDailySessionState<SessionState>({
    grid: state.piecesOrder.map((id) => ({ id })),
    justDroppedIds: [],
    activeDrag: null,
  });

  // 1. Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const totalSlots = data.pieces ? data.pieces.length : 0;
      const rows = Math.max(1, Math.ceil(totalSlots / COLS));
      const maxWidth = containerRef.current.offsetWidth - 36;
      const maxHeight = window.innerHeight - 200;

      // Calculate dimensions respecting 2:3 aspect ratio and max constraints
      let safeWidth = maxWidth > 0 ? maxWidth : 300;
      let totalHeight = safeWidth * 1.5; // 2:3 aspect ratio

      // If height exceeds maxHeight, recalculate based on height constraint
      if (totalHeight > maxHeight) {
        totalHeight = maxHeight;
        safeWidth = totalHeight / 1.5; // Maintain 2:3 aspect ratio
      }

      const cellWidth = safeWidth / COLS;
      const cellHeight = totalHeight / rows;
      setMeasures({ width: safeWidth, height: totalHeight, cellWidth, cellHeight, rows, totalSlots });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [data.pieces]);

  // --- Group Logic ---

  const countConnections = (gridState: GridState): number => {
    let connections = 0;
    for (let idx = 0; idx < gridState.length; idx++) {
      const piece = gridState[idx];
      if (!piece) continue;

      // Check right neighbor (horizontal)
      const rightIdx = idx + 1;
      if (rightIdx < gridState.length && Math.floor(idx / COLS) === Math.floor(rightIdx / COLS)) {
        const rightPiece = gridState[rightIdx];
        if (rightPiece && arePiecesConnectable(piece.id, rightPiece.id, true)) {
          connections++;
        }
      }

      // Check bottom neighbor (vertical)
      const bottomIdx = idx + COLS;
      if (bottomIdx < gridState.length) {
        const bottomPiece = gridState[bottomIdx];
        if (bottomPiece && arePiecesConnectable(piece.id, bottomPiece.id, false)) {
          connections++;
        }
      }
    }
    return connections;
  };

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
        if (idx < 0 || idx >= measures.totalSlots) continue;

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
      if (neighborIdx < 0 || neighborIdx >= measures.totalSlots) return false;
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
    const hasBottom = bottomIdx < measures.totalSlots && checkConnection(bottomIdx, 'vertical');
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
    if (isComplete) return;
    const { active } = event;
    const { piece, originIndex } = active.data.current as { piece: PieceData; originIndex: number };
    const groupIndices = getConnectedGroupIndices(session.grid, originIndex);
    const relativeGroup = groupIndices.map((idx) => idx - originIndex);
    playSFX('bubbleIn');
    setSession((prev) => ({
      ...prev,
      activeDrag: { pieceId: piece.id, originIndex, groupIndices: relativeGroup },
      justDroppedIds: [],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    const dragData = session.activeDrag;

    if (!over || !dragData || isComplete) return;

    const targetAnchorIndex = over.data.current?.index as number;
    const sourceAnchorIndex = dragData.originIndex;

    if (targetAnchorIndex === sourceAnchorIndex) {
      playSFX('bubbleOut');
      setSession((prev) => ({ ...prev, activeDrag: null }));
      return;
    }

    const sourceIndices = dragData.groupIndices.map((offset) => sourceAnchorIndex + offset);
    const targetIndices = dragData.groupIndices.map((offset) => targetAnchorIndex + offset);

    const isValidMove = targetIndices.every((idx) => idx >= 0 && idx < measures.totalSlots);
    if (!isValidMove) {
      playSFX('bubbleOut');
      setSession((prev) => ({ ...prev, activeDrag: null }));
      return;
    }

    // 1. Identify which pieces are being "dropped" by the user
    const draggedPieceIds = sourceIndices
      .map((idx) => session.grid[idx]?.id)
      .filter((id) => id !== undefined) as number[];

    // Count connections before the swap
    const connectionsBefore = countConnections(session.grid);

    playSFX('swap');
    // 2. Perform the swap
    let nextGrid: GridState = [];
    setSession((prev) => {
      nextGrid = [...prev.grid];
      const sourceSet = new Set(sourceIndices);
      const targetSet = new Set(targetIndices);

      const displacedValues = targetIndices.filter((idx) => !sourceSet.has(idx)).map((idx) => prev.grid[idx]);

      const vacatedSlots = sourceIndices.filter((idx) => !targetSet.has(idx));

      vacatedSlots.forEach((slotIndex, i) => {
        if (i < displacedValues.length) {
          nextGrid[slotIndex] = displacedValues[i];
        }
      });

      targetIndices.forEach((targetIdx, i) => {
        const sourceIdx = sourceIndices[i];
        nextGrid[targetIdx] = prev.grid[sourceIdx];
      });

      return { ...prev, grid: nextGrid, activeDrag: null, justDroppedIds: draggedPieceIds };
    });

    // Count connections after the swap and only add score if new connections were made
    const connectionsAfter = countConnections(nextGrid);
    const newConnections = connectionsAfter - connectionsBefore;

    // Calculate total possible connections: horizontal + vertical
    // Horizontal: rows × (COLS - 1), Vertical: COLS × (rows - 1)
    const totalPossibleConnections = measures.rows * (COLS - 1) + COLS * (measures.rows - 1);

    const newStatus = connectionsAfter === totalPossibleConnections ? STATUSES.WIN : state.status;
    if (newStatus === STATUSES.WIN) {
      playSFX('win');
    }

    updateState({
      swapCount: state.swapCount + 1,
      score: Math.max(
        state.score +
          (newConnections > 0 ? newConnections * state.hearts : 0) -
          // When done, reduce the score based on time taken (in seconds)
          (newStatus === STATUSES.WIN ? totalSeconds : 0),
        0,
      ),
      status: newStatus,
      piecesOrder: nextGrid.map((piece) => (piece ? piece.id : -1)),
    });

    // 3. Clear the "just dropped" flag after a short delay so future auto-moves animate
    setTimeout(() => {
      setSession((prev) => ({ ...prev, justDroppedIds: [] }));
    }, 250);
  };

  return {
    hearts: state.hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    handleDragStart,
    handleDragEnd,
    sensors,
    containerRef,
    piecesOrder: state.piecesOrder,
    measures,
    totalTime: totalSeconds,
    score: state.score,
    getBorders,
    allPieceIds,
    justDroppedIds: session.justDroppedIds,
    activeDrag: session.activeDrag,
    grid: session.grid,
    swapCount: state.swapCount,
    correctPieces: session.grid.filter((piece, index) => piece?.id === index).length,
  };
}
