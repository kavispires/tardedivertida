import type { DragEndEvent } from '@dnd-kit/core';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Pages
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
// Internal
import type { DailyAlienadoEntry, GameState, SessionState } from './types';
import { SETTINGS } from './settings';

export function useAlienadoEngine(data: DailyAlienadoEntry, initialState: GameState) {
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
    updateSession({ slotIndex });
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
          return { ...prev, selection: newSelection, slotIndex: null };
        });
        playSFX('bubbleIn');
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const itemId = active.data.current?.itemId as string;
    const source = active.data.current?.source as 'pool' | 'slot';
    const sourceIndex = active.data.current?.index as number | undefined;

    // 1. Dragged out of bounds (Remove Item)
    if (!over) {
      if (source === 'slot' && sourceIndex !== undefined) {
        playSFX('bubbleOut');
        setSession((prev) => {
          const newSelection = [...prev.selection];
          newSelection[sourceIndex] = null;
          return { ...prev, selection: newSelection };
        });
      }
      return;
    }

    const overId = String(over.id);
    if (overId.startsWith('slot-')) {
      const targetIndex = Number.parseInt(overId.replace('slot-', ''), 10);

      // 2. Dragged from Pool -> Slot
      if (source === 'pool') {
        playSFX('bubbleIn');
        setSession((prev) => {
          const newSelection = [...prev.selection];
          // Prevent duplicates if it was somehow already placed
          const existingIndex = newSelection.indexOf(itemId);
          if (existingIndex !== -1) newSelection[existingIndex] = null;

          newSelection[targetIndex] = itemId;
          return { ...prev, selection: newSelection, slotIndex: null };
        });
      }
      // 3. Dragged from Slot -> Slot (Move or Swap)
      else if (source === 'slot' && sourceIndex !== undefined) {
        if (sourceIndex === targetIndex) return; // Dropped on same spot

        playSFX('bubbleIn');
        setSession((prev) => {
          const newSelection = [...prev.selection];
          const temp = newSelection[targetIndex]; // Might be null (move) or an item (swap)
          newSelection[targetIndex] = itemId;
          newSelection[sourceIndex] = temp;
          return { ...prev, selection: newSelection, slotIndex: null };
        });
      }
    }
  };

  const submitGuess = () => {
    // ... Existing submit logic stays identical ...
    const newGuessString = session.selection.join('-');

    if (state.guesses.includes(newGuessString)) {
      message.warning({
        content: translate({
          pt: 'Você já tentou essa combinação. Tente outra!',
          en: 'You already tried this combination. Try another one!',
        }),
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
        content: translate({
          pt: 'Combinação incorreta. Tente novamente!',
          en: 'Incorrect combination. Try again!',
        }),
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

  const isWin = state.status === STATUSES.WIN;
  const isLose = state.status === STATUSES.LOSE;
  const isComplete = isWin || isLose;

  useMarkAsPlayed({ key: SETTINGS.KEY, isComplete });

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
    handleDragEnd,
    submitGuess,
    isReady,
  };
}
