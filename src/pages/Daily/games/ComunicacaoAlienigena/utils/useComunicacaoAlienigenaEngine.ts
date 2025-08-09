import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Internal
import type { DailyComunicacaoAlienigenaEntry, GameState, SessionState } from './types';
import { SETTINGS } from './settings';

export function useComunicacaoAlienigenaEngine(
  data: DailyComunicacaoAlienigenaEntry,
  initialState: GameState,
) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, updateState } = useDailyGameState<GameState>(initialState);
  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    selection: [null, null, null, null],
    slotIndex: null,
    latestAttempt: null,
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

  // ACTIONS
  const onSlotClick = (slotIndex: number) => {
    updateSession({
      slotIndex,
    });
  };

  const onItemClick = (itemId: string) => {
    if (session.selection.includes(itemId)) {
      updateSession({
        selection: session.selection.map((item) => (item === itemId ? null : item)),
      });
      playSFX('bubbleOut');
    } else {
      const firstNullIndex = session.slotIndex ?? session.selection.indexOf(null);
      if (firstNullIndex !== -1) {
        setSession((prev) => {
          const newSelection = [...session.selection];
          newSelection[firstNullIndex] = itemId;
          return {
            ...prev,
            selection: newSelection,
            slotIndex: null,
          };
        });
        playSFX('bubbleIn');
      }
    }
  };

  const submitGuess = () => {
    const newGuessString = session.selection.join('-');

    if (state.guesses.includes(newGuessString)) {
      message.warning({
        content: translate(
          'Você já tentou essa combinação. Tente outra!',
          'You already tried this combination. Try another one!',
        ),
        duration: 5,
      });

      playSFX('wrong');
      vibrate('wrong');
      return updateSession({
        latestAttempt: Date.now(),
      });
    }

    const isCorrect = data.solution === newGuessString;

    if (!isCorrect) {
      message.warning({
        content: translate('Combinação incorreta. Tente novamente!', 'Incorrect combination. Try again!'),
        duration: 3,
      });
    }

    let updatedStatus = state.status;
    const updatedHearts = isCorrect ? state.hearts : state.hearts - 1;

    if (isCorrect) {
      playSFX('alienYay');
      updatedStatus = STATUSES.WIN;
      logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
    } else {
      playSFX('alienBoo');
      vibrate('lose');
    }

    if (updatedHearts === 0) {
      updatedStatus = STATUSES.LOSE;
      logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
    }

    updateState({
      guesses: [...state.guesses, newGuessString],
      hearts: updatedHearts,
      status: updatedStatus,
    });

    updateSession({
      latestAttempt: Date.now(),
    });
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

  const isReady = session.selection.filter(Boolean).length === data.requests.length;

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    selection: session.selection,
    latestAttempt: session.latestAttempt,
    slotIndex: session.slotIndex,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onSlotClick,
    onItemClick,
    submitGuess,
    isReady,
  };
}
