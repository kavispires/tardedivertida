import { useCountdown } from 'hooks/useCountdown';
import { intersectionBy } from 'lodash';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { inNSeconds } from 'utils/helpers';

import { getDiscs } from './helpers';
import { SETTINGS } from './settings';
import { AquiODisc, AquiOLocalToday, DailyAquiOEntry } from './types';

type GameState = {
  hearts: number;
  goal: number;
  discs: AquiODisc[];
  discIndex: number;
  attempts: number;
};

const defaultAquiOLocalToday: AquiOLocalToday = {
  id: '',
  number: 0,
  discs: 0,
  hardMode: false,
  attempts: 0,
  hearts: SETTINGS.HEARTS,
};

export function useAquiOEngine(data: DailyAquiOEntry, isRandomGame: boolean) {
  const [timesUp, setTimesUp] = useState(false);

  const [mode, setMode] = useLocalStorage(SETTINGS.TD_DAILY_AQUI_O_MODE, 'normal');

  const [state, setState] = useState<GameState>({
    hearts: SETTINGS.HEARTS,
    goal: SETTINGS.GOAL,
    discs: [],
    discIndex: 0,
    attempts: 0,
  });

  const { localToday, updateLocalStorage } = useDailyLocalToday<AquiOLocalToday>({
    key: SETTINGS.TD_DAILY_AQUI_O_LOCAL_TODAY,
    gameId: data.id,
    challengeNumber: data.number,
    defaultValue: defaultAquiOLocalToday,
    disabled: isRandomGame,
    onApplyLocalState: (value) => {
      setState((prev) => ({
        ...prev,
        discIndex: value.discs,
        attempts: value.attempts,
        hearts: value.hearts,
      }));
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
    duration: 60,
    autoStart: false,
    onExpire: () => {
      setTimesUp(true);
      if (!isRandomGame) {
        updateLocalStorage({
          hardMode: mode === 'challenge',
          attempts: state.attempts,
          hearts: state.hearts,
          discs: state.discIndex > (localToday?.discs ?? 0) ? state.discIndex : localToday?.discs ?? 0,
        });
      }
    },
  });

  // ACTIONS
  const onStart = () => {
    setState((prev) => ({
      ...prev,
      discs: getDiscs(data, mode === 'challenge'),
      discIndex: 0,
      attempts: prev.attempts + 1,
    }));
    restart(inNSeconds(60), true);
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
    }
  }, [isWin, isLose]); // eslint-disable-line react-hooks/exhaustive-deps

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete, () => pause());

  return {
    hearts: state.hearts,
    discIndex: state.discIndex,
    attempts: state.attempts,
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
    localToday,
  };
}
