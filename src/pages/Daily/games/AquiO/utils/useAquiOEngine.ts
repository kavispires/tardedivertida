import { intersectionBy } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { inNSeconds } from 'utils/helpers';
// Internal
import { DEFAULT_LOCAL_TODAY, getDiscs } from './helpers';
import { SETTINGS } from './settings';
import type { AquiOLocalToday, DailyAquiOEntry, GameState } from './types';

const DURATION = 60;

export function useAquiOEngine(data: DailyAquiOEntry, initialState: GameState, isRandomGame: boolean) {
  const [timesUp, setTimesUp] = useState(false);

  const [mode, setMode] = useLocalStorage(SETTINGS.TD_DAILY_AQUI_O_MODE, 'normal');

  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<AquiOLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });

  // ADDITIONAL STATE
  const discA = state.discs[state.discIndex];
  const discB = state.discs[state.discIndex + 1];

  const result = useMemo(
    () => intersectionBy(discA?.items ?? [], discB?.items ?? [], 'itemId')?.[0]?.itemId,
    [discA, discB],
  );

  // TIMER
  const { timeLeft, isRunning, restart, pause } = useCountdown({
    duration: DURATION,
    autoStart: false,
    onExpire: () => {
      setTimesUp(true);
      if (!isRandomGame) {
        updateLocalStorage({
          hardMode: mode === 'challenge',
          hearts: state.hearts,
          maxProgress: Math.max(state.discIndex, state.maxProgress),
        });
        updateState({
          maxProgress: Math.max(state.discIndex, state.maxProgress),
        });
      }
    },
  });

  // ACTIONS
  const onStart = () => {
    updateLocalStorage({
      attempts: state.attempts + 1,
    });
    setState((prev) => ({
      ...prev,
      discs: getDiscs(data, mode === 'challenge'),
      discIndex: 0,
      attempts: prev.attempts + 1,
    }));

    restart(inNSeconds(DURATION), true);
  };

  const onSelect = (itemId: string) => {
    if (itemId === result) {
      setState((prev) => ({ ...prev, discIndex: prev.discIndex + 1 }));
    } else {
      setState((prev) => ({ ...prev, hearts: prev.hearts - 1 }));
    }
  };

  // CONDITIONS
  const isWin = state.discIndex === SETTINGS.GOAL;
  const isLose = state.hearts <= 0;
  const isComplete = (isWin || isLose || timesUp || state.attempts > 0) && !isRunning;

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only need isWin and isLose
  useEffect(() => {
    if (isWin || isLose) {
      pause();
      setTimesUp(true);
      if (isWin) {
        updateLocalStorage({
          maxProgress: SETTINGS.GOAL,
        });
      }
    }
  }, [isWin, isLose]);

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete, () => pause());

  return {
    hearts: state.hearts,
    discIndex: state.discIndex,
    attempts: state.attempts,
    maxProgress: state.maxProgress,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onStart,
    onSelect,
    timeLeft,
    mode,
    setMode,
    discA,
    discB,
    result,
    isPlaying: isRunning,
  };
}
