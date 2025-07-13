import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
import { useEffect } from 'react';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Internal
import { SETTINGS } from './settings';
import type { DailyOrganikuEntry, GameState, SessionState } from './types';

export function useOrganikuEngine(data: DailyOrganikuEntry, initialState: GameState) {
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { session, updateSession } = useDailySessionState<SessionState>({
    activeTileIndex: null,
    pairActiveTileIndex: null,
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

  const onActivateTile = (index: number) => {
    // If it's the same, unselect
    if (session.activeTileIndex === index) {
      playSFX('bubbleOut');
      updateSession({ activeTileIndex: null });
      return;
    }
    const flips = state.flips + 1;

    // If it's new (first selection)
    if (session.activeTileIndex === null) {
      updateSession({ activeTileIndex: index });
      updateState({ flips });
      playSFX('bubbleIn');
      return;
    }

    // Second tile selected - show it immediately
    playSFX('bubbleIn');
    updateSession({ activeTileIndex: session.activeTileIndex, pairActiveTileIndex: index });
    updateState({ flips });

    const { activeTileIndex } = session;
    // Delay the match check to allow the user to see the second tile
    setTimeout(() => {
      const activeItemId = data.grid[activeTileIndex];
      const selectedItemId = data.grid[index];
      const isMatch = activeItemId === selectedItemId;

      updateSession({ activeTileIndex: null, pairActiveTileIndex: null });

      // If it's correct
      if (isMatch) {
        const isWin = Object.keys(state.revealed).length + 2 === data.grid.length;

        if (isWin) {
          playSFX('win');
          logAnalyticsEvent(`daily_${SETTINGS.KEY}_win`);
        } else {
          playSFX('wee');
        }

        setState((prevState) => ({
          ...prevState,
          status: isWin ? STATUSES.WIN : STATUSES.IN_PROGRESS,
          revealed: {
            ...prevState.revealed,
            [activeTileIndex]: true,
            [index]: true,
          },
          foundCount: {
            ...prevState.foundCount,
            [activeItemId]: (prevState.foundCount[activeItemId] || 0) + 2,
          },
        }));
        return;
      }

      // If it's incorrect
      const hearts = state.hearts - 1;
      const isLose = hearts <= 0;

      if (isLose) {
        playSFX('lose');
        vibrate('lose');
        logAnalyticsEvent(`daily_${SETTINGS.KEY}_lose`);
      } else {
        playSFX('wrong');
        vibrate('wrong');
      }

      setState((prevState) => ({
        ...prevState,
        status: isLose ? STATUSES.LOSE : STATUSES.IN_PROGRESS,
        revealed: {
          ...prevState.revealed,
        },
        hearts: prevState.hearts - 1,
      }));
    }, 750); // Show both tiles for 750ms before resolving
  };

  // CONDITIONS
  const isWin = state.status === STATUSES.WIN;
  const isLose = state.status === STATUSES.LOSE;
  const isComplete = isWin || isLose;

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isWin || isLose || isComplete);

  return {
    hearts: state.hearts,
    revealed: state.revealed,
    foundCount: state.foundCount,
    flips: state.flips,
    activeTileIndex: session.activeTileIndex,
    pairActiveTileIndex: session.pairActiveTileIndex,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onActivateTile,
  };
}
