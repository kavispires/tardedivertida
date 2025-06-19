import { intersectionBy } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Utils
import { inNSeconds } from 'utils/helpers';
// Internal
import { checkWeekend, getDiscs } from './helpers';
import { SETTINGS } from './settings';
import type { DailyAquiOEntry, GameState, SessionState } from './types';

export function useAquiOEngine(data: DailyAquiOEntry, initialState: GameState) {
  const [timesUp, setTimesUp] = useState(false);

  const [mode, setMode] = useLocalStorage(SETTINGS.TD_DAILY_AQUI_O_MODE, 'normal');

  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);
  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    discIndex: 0,
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

  // ADDITIONAL STATE
  const discA = state.discs[session.discIndex];
  const discB = state.discs[session.discIndex + 1];

  const result = useMemo(
    () => intersectionBy(discA?.items ?? [], discB?.items ?? [], 'itemId')?.[0]?.itemId,
    [discA, discB],
  );

  // TIMER
  const { timeLeft, isRunning, restart, pause } = useCountdown({
    duration: SETTINGS.DURATION,
    autoStart: false,
    onExpire: () => {
      setTimesUp(true);

      updateState({
        maxProgress: Math.max(session.discIndex, state.maxProgress),
      });
    },
  });

  // ACTIONS
  const onStart = () => {
    setState((prev) => ({
      ...prev,
      discs: getDiscs(data, mode === 'challenge', checkWeekend(data.id)),
      attempts: prev.attempts + 1,
    }));
    updateSession({ discIndex: 0 });
    playSFX('addCorrect');
    logAnalyticsEvent(`daily_${SETTINGS.KEY}_played`);
    restart(inNSeconds(SETTINGS.DURATION), true);
  };

  const onSelect = (itemId: string) => {
    // If correct
    if (itemId === result) {
      const nextDiscIndex = session.discIndex + 1;
      // If it's win (last disc)
      if (nextDiscIndex === SETTINGS.GOAL) {
        updateState({
          status: STATUSES.WIN,
          maxProgress: SETTINGS.GOAL,
        });
        pause();
        setTimesUp(true);
        playSFX('win');
        logAnalyticsEvent(`daily_${SETTINGS.KEY}_win`);
        return;
      }

      // If not the last disc
      setSession((prev) => ({ ...prev, discIndex: nextDiscIndex }));
      updateState({
        maxProgress: Math.max(nextDiscIndex, state.maxProgress),
      });
      playSFX('correct');
      return;
    }

    // If last heart
    if (state.hearts === 1) {
      updateState({
        status: STATUSES.LOSE,
        hearts: 0,
      });
      pause();
      setTimesUp(true);
      playSFX('lose');
      vibrate('lose');
      logAnalyticsEvent(`daily_${SETTINGS.KEY}_lose`);
      return;
    }

    setState((prev) => ({ ...prev, hearts: prev.hearts - 1 }));
    playSFX('wrong');
    vibrate('wrong');
  };

  const onModeChange = (newMode: 'normal' | 'challenge') => {
    updateState({ hardMode: newMode === 'challenge' });
    setMode(newMode);
  };

  // CONDITIONS
  const isWin = state.status === STATUSES.WIN;
  const isLose = state.status === STATUSES.LOSE;
  const isComplete = (isWin || isLose || timesUp || state.attempts > 0) && !isRunning;

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete, () => pause());

  return {
    hearts: state.hearts,
    discIndex: session.discIndex,
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
    onModeChange,
    discA,
    discB,
    result,
    isPlaying: isRunning,
  };
}
