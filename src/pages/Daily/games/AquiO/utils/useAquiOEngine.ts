import { useCountdown } from 'hooks/useCountdown';
import { intersectionBy } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { inNSeconds } from 'utils/helpers';

import { getDiscs } from './helpers';
import { SETTINGS } from './settings';
import { AquiOLocalToday, DailyAquiOEntry, GameState } from './types';

const defaultAquiOLocalToday: AquiOLocalToday = {
  id: '',
  number: 0,
  maxProgress: 0,
  hardMode: false,
  attempts: 0,
  hearts: SETTINGS.HEARTS,
  status: 'idle',
};

const DURATION = 60;

export function useAquiOEngine(data: DailyAquiOEntry, isRandomGame: boolean) {
  const [timesUp, setTimesUp] = useState(false);

  const [mode, setMode] = useLocalStorage(SETTINGS.TD_DAILY_AQUI_O_MODE, 'normal');

  const { state, setState, updateState } = useDailyGameState<GameState>({
    hearts: SETTINGS.HEARTS,
    goal: SETTINGS.GOAL,
    discs: [],
    discIndex: 0,
    attempts: 0,
    maxProgress: 0,
  });

  const { updateLocalStorage } = useDailyLocalToday<AquiOLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number,
    defaultValue: defaultAquiOLocalToday,
    disabled: isRandomGame,
    onApplyLocalState: (value) => {
      updateState({
        discIndex: value.maxProgress,
        maxProgress: value.maxProgress,
        attempts: value.attempts ?? 0,
        hearts: value.hearts,
      });
    },
  });

  // ADDITIONAL STATE
  const discA = state.discs[state.discIndex];
  const discB = state.discs[state.discIndex + 1];

  const result = useMemo(
    () => intersectionBy(discA?.items ?? [], discB?.items ?? [], 'itemId')?.[0]?.itemId,
    [discA, discB]
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
          status: 'played',
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

  useEffect(() => {
    if (isWin || isLose) {
      pause();
      setTimesUp(true);
      if (isWin) {
        updateLocalStorage({
          maxProgress: SETTINGS.GOAL,
          status: 'played',
        });
      } else {
        updateLocalStorage({
          status: 'played',
        });
      }
    }
  }, [isWin, isLose]); // eslint-disable-line react-hooks/exhaustive-deps

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
