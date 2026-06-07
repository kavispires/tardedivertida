import { useEffect, useMemo } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Pages
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useMarkAsPlayed } from 'pages/Daily/hooks/useDailyPlayTracker';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { DailyPanicoEntry, GameState, SessionState } from './types';
import { buildButtons } from './engine';

export function usePanicoEngine(data: DailyPanicoEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);
  const { message } = App.useApp();
  const { translate } = useLanguage();

  const builtButtons = useMemo(() => buildButtons(data.buttons), [data.buttons]);

  const { session, updateSession } = useDailySessionState<SessionState>({
    activeButtonIndex: -1,
    status: 'idle',
    buttons: builtButtons,
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

  const onNextButton = (isCorrect: boolean) => {
    const nextActiveButtonIndex = session.activeButtonIndex + 1;
    // If the player did what they were supposed to do
    if (isCorrect) {
      const isWin = nextActiveButtonIndex === state.totalButtons;

      if (isWin) {
        playSFX('win');
        // logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
        setState((prevState) => ({
          ...prevState,
          status: STATUSES.WIN,
          farthestButtonIndex: nextActiveButtonIndex,
        }));
        return;
      }

      playSFX('select');

      setState((prevState) => ({
        ...prevState,
        status: STATUSES.IN_PROGRESS,
        farthestButtonIndex: Math.max(prevState.farthestButtonIndex, nextActiveButtonIndex, 0),
      }));
      updateSession({ activeButtonIndex: nextActiveButtonIndex, status: isWin ? 'idle' : 'ongoing' });
    } else {
      const hearts = state.hearts - 1;
      const isLose = hearts <= 0;

      if (isLose) {
        playSFX('lose');
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
      } else {
        playSFX('drama');
        message.warning(
          translate({
            pt: 'Oops, você fez algo errado! Tente novamente.',
            en: 'Oops, you did something wrong! Try again.',
          }),
        );
      }

      setState((prevState) => ({
        ...prevState,
        status: isLose ? STATUSES.LOSE : STATUSES.IN_PROGRESS,
        hearts,
        farthestButtonIndex: Math.max(prevState.farthestButtonIndex, session.activeButtonIndex, 0),
      }));
      updateSession({ activeButtonIndex: -1, status: 'idle' });
    }
  };

  const onStart = () => {
    updateSession({ activeButtonIndex: 0, status: 'ongoing' });
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
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onNextButton,
    onStart,
    activeButtonIndex: session.activeButtonIndex,
    sessionStatus: session.status,
    buttons: session.buttons,
    farthestButtonIndex: state.farthestButtonIndex,
  };
}
