import { type DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
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
import type { DailyVitraisEntry, GameState, Piece, PieceState, SessionState } from './types';

const generateRepackedState = (
  currentDict: Dictionary<PieceState>,
  staticPieces: Piece[],
  blockSize: number,
  cWidth: number,
  bOffset: { x: number; y: number },
  data: DailyVitraisEntry,
  lockedPieces: string[],
): Dictionary<PieceState> => {
  const boardHeight = data.gridRows * blockSize;

  // Count unlocked pieces to determine bank size
  // If state is empty (first load), check static data for starter piece
  let looseCount = 0;
  const isInit = Object.keys(currentDict).length === 0;

  if (isInit) {
    looseCount = staticPieces.length - 1; // All loose except starting piece
  } else {
    looseCount = Object.values(currentDict).filter((p) => !p.isLocked).length;
  }

  const bankWidth = Math.max(200, looseCount * 80);

  const newState: Dictionary<PieceState> = {};

  const yPositions = [5, 15, 25, 15, 35, 25, 15, 20, 15, 5];

  staticPieces.forEach((p, i) => {
    // Decode Grid Position
    const gridX = p.correctPos % data.gridCols;
    const gridY = Math.floor(p.correctPos / data.gridCols);

    const correctPixelX = bOffset.x + gridX * blockSize;
    const correctPixelY = bOffset.y + gridY * blockSize;

    // Check if locked (either in current state OR it's the starter piece on init)
    const isLocked = currentDict[p.id]?.isLocked || (isInit && p.id === data.startingPieceId);

    if (isLocked || lockedPieces.includes(p.id)) {
      // Force locked pieces to exact grid position (handles window resize adjustments)
      newState[p.id] = {
        x: correctPixelX,
        y: correctPixelY,
        isLocked: true,
      };
    } else {
      // Calculate Scatter Bounds

      // Always place unlocked pieces below the board guide
      const minX = Math.max(0, bOffset.x);
      const maxX = Math.max(cWidth - blockSize * 1.5, minX + bankWidth);

      const xWidth = maxX - minX;
      const xUnit = xWidth / (data.gridCols - 1);

      // const randomX = xWidth / 4 + random(-(minX + blockSize), maxX - blockSize);
      const xPositions = [5, xUnit, xUnit * 2, xUnit / 2, xUnit * 1.5, xUnit];
      const randomX = minX + xPositions[i % xPositions.length];
      const randomY = blockSize / 2 + boardHeight + yPositions[i % yPositions.length];

      // If we already have a position and we are NOT repacking specifically (e.g. just resizing),
      // we might want to keep it?
      // For this implementation, "generateRepackedState" implies we WANT to move them to the new bank.
      // So we overwrite with new random positions.
      newState[p.id] = {
        x: randomX,
        y: randomY,
        isLocked: false,
      };
    }
  });

  return newState;
};

export function useVitraisEngine(data: DailyVitraisEntry, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);
  const [rulesOpen] = useDailyGlobalStore('rulesOpen');

  const { totalSeconds, seconds, minutes, isRunning, start, pause } = useStopwatch({
    autoStart: true,
    offsetTimestamp: moment(new Date()).add(state.timeElapsed, 'seconds').toDate(),
  });

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

  // GEMINI STUFF
  // const [pieces, setPieces] = useState<ActivePiece[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layout State
  const [blockSize, setBlockSize] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 20 });

  const { session, setSession } = useDailySessionState<SessionState>({
    piecesState: generateRepackedState(
      {}, // Empty dict triggers init logic (checking startingPieceId)
      data.pieces,
      blockSize,
      containerSize.width,
      boardOffset,
      data,
      state.lockedPieces,
    ),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // 1. Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = window.innerHeight - 200;

      const maxBlockWidth = (width - 32) / data.gridCols;
      const newBlockSize = Math.min(50, Math.floor(maxBlockWidth));

      const boardWidth = data.gridCols * newBlockSize;
      const offsetX = (width - boardWidth) / 2;

      setBlockSize(newBlockSize);
      setContainerSize({ width, height });
      setBoardOffset({ x: offsetX, y: 20 });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [data.gridCols]);

  // 2. Reposition pieces when layout is ready
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reposition on layout change
  useEffect(() => {
    if (blockSize === 0 || containerSize.width === 0) return;

    // Check if starting piece is at correct position
    const startingPiece = data.pieces.find((p) => p.id === data.startingPieceId);
    if (!startingPiece) return;

    const gridX = startingPiece.correctPos % data.gridCols;
    const gridY = Math.floor(startingPiece.correctPos / data.gridCols);
    const expectedX = boardOffset.x + gridX * blockSize;
    const expectedY = boardOffset.y + gridY * blockSize;

    const currentState = session.piecesState[data.startingPieceId];
    const needsRepositioning = !currentState || currentState.x !== expectedX || currentState.y !== expectedY;

    if (needsRepositioning) {
      setSession({
        ...session,
        piecesState: generateRepackedState(
          session.piecesState,
          data.pieces,
          blockSize,
          containerSize.width,
          boardOffset,
          data,
          state.lockedPieces,
        ),
      });
    }
  }, [blockSize, boardOffset.x, containerSize.width]);

  // Reset unlocked pieces to their initial positions
  const resetUnlockedPieces = () => {
    if (blockSize === 0 || containerSize.width === 0) return;

    setSession({
      ...session,
      piecesState: generateRepackedState(
        session.piecesState,
        data.pieces,
        blockSize,
        containerSize.width,
        boardOffset,
        data,
        state.lockedPieces,
      ),
    });
    playSFX('shuffle');
  };

  // 3. Drag Logic
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const pieceId = active.id as string;

    setSession((prev) => {
      const currentState = prev.piecesState[pieceId];
      if (!currentState) return prev; // Should not happen

      // Find static data to get correct grid position
      const pieceStatic = data.pieces.find((p) => p.id === pieceId);
      if (!pieceStatic) return prev;

      const gridX = pieceStatic.correctPos % data.gridCols;
      const gridY = Math.floor(pieceStatic.correctPos / data.gridCols);

      // New Raw Position
      let newX = currentState.x + delta.x;
      let newY = currentState.y + delta.y;

      // Calculate piece bounds based on shape
      const minBlockX = Math.min(...pieceStatic.shape.map((b) => b.x));
      const maxBlockX = Math.max(...pieceStatic.shape.map((b) => b.x));
      const minBlockY = Math.min(...pieceStatic.shape.map((b) => b.y));
      const maxBlockY = Math.max(...pieceStatic.shape.map((b) => b.y));

      const pieceLeftEdge = newX + minBlockX * blockSize;
      const pieceRightEdge = newX + (maxBlockX + 1) * blockSize;
      const pieceTopEdge = newY + minBlockY * blockSize;
      const pieceBottomEdge = newY + (maxBlockY + 1) * blockSize;

      // Check if piece is fully out of bounds
      const isFullyOutOfBounds =
        pieceRightEdge < 0 ||
        pieceLeftEdge > containerSize.width ||
        pieceBottomEdge < 0 ||
        pieceTopEdge > containerSize.height;

      // If fully out of bounds, reset to center of container
      if (isFullyOutOfBounds) {
        const pieceWidth = (maxBlockX - minBlockX + 1) * blockSize;
        const pieceHeight = (maxBlockY - minBlockY + 1) * blockSize;
        newX = (containerSize.width - pieceWidth) / 2 - minBlockX * blockSize;
        newY = (containerSize.height - pieceHeight) / 2 - minBlockY * blockSize;
      }

      // Calculate Snap Target
      const targetX = boardOffset.x + gridX * blockSize;
      const targetY = boardOffset.y + gridY * blockSize;

      const dist = Math.sqrt((newX - targetX) ** 2 + (newY - targetY) ** 2);
      const snapDist = blockSize * 0.45;

      let justLocked = false;
      let isLocked = false;

      if (dist < snapDist) {
        newX = targetX;
        newY = targetY;
        isLocked = true;
        justLocked = true;
      }

      // Update this specific piece
      const updatedPiecesState = {
        ...prev.piecesState,
        [pieceId]: { x: newX, y: newY, isLocked },
      };
      let score = state.score;
      let status = state.status;

      // Auto-Repack Trigger
      if (justLocked) {
        // If we locked a piece, reshuffle the REMAINING unlocked pieces
        const allLocked = Object.values(updatedPiecesState).every((p) => p.isLocked);
        if (allLocked) {
          playSFX('win');
          status = STATUSES.WIN;
        } else {
          playSFX('yes');
          score += 1 + state.hearts;
        }
        const lockedPiecesIds = Object.entries(updatedPiecesState)
          .filter(([_, pState]) => pState.isLocked)
          .map(([pId, _]) => pId);

        updateState({
          lockedPieces: lockedPiecesIds,
          score,
          status,
        });

        return {
          ...prev,
          piecesState: generateRepackedState(
            updatedPiecesState,
            data.pieces,
            blockSize,
            containerSize.width,
            boardOffset,
            data,
            lockedPiecesIds,
          ),
        };
      }

      playSFX('bubbleOut');
      return {
        ...prev,
        piecesState: updatedPiecesState,
      };
    });
  };

  return {
    hearts: state.hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    handleDragEnd,
    resetUnlockedPieces,
    sensors,
    containerRef,
    piecesState: session.piecesState,
    lockedPieces: state.lockedPieces,
    blockSize,
    boardOffset,
    totalTime: totalSeconds,
    score: state.score,
  };
}
