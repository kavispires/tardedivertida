import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import type { ComunicacaoAlienigenaLocalToday, DailyComunicacaoAlienigenaEntry, GameState } from './types';
import { SETTINGS } from './settings';
import { DEFAULT_LOCAL_TODAY } from './helpers';

export function useComunicacaoAlienigenaEngine(
  data: DailyComunicacaoAlienigenaEntry,
  initialState: GameState,
) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<ComunicacaoAlienigenaLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });

  // ACTIONS
  const onSlotClick = (slotIndex: number) => {
    setState((prev) => ({
      ...prev,
      slotIndex,
    }));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!state.win && state.guesses.some((guess) => guess === data.solution)) {
      setState((prev) => ({ ...prev, win: true }));
    }
  }, [state.guesses, data.solution, state.win]);

  const onItemClick = (itemId: string) => {
    if (state.selection.includes(itemId)) {
      setState((prev) => ({
        ...prev,
        selection: prev.selection.map((item) => (item === itemId ? null : item)),
      }));
    } else {
      const firstNullIndex = state.slotIndex ?? state.selection.indexOf(null);
      if (firstNullIndex !== -1) {
        setState((prev) => {
          const newSelection = [...prev.selection];
          newSelection[firstNullIndex] = itemId;
          return {
            ...prev,
            selection: newSelection,
            slotIndex: null,
          };
        });
      }
    }
  };

  const submitGuess = () => {
    const newGuessString = state.selection.join('-');

    if (state.guesses.includes(newGuessString)) {
      message.warning({
        content: translate(
          'Você já tentou essa combinação. Tente outra!',
          'You already tried this combination. Try another one!',
        ),
        duration: 5,
      });

      return updateState({
        latestAttempt: Date.now(),
      });
    }

    updateLocalStorage({
      guesses: [...state.guesses, newGuessString],
    });

    const isCorrect = data.solution === newGuessString;

    if (!isCorrect) {
      message.warning({
        content: translate('Combinação incorreta. Tente novamente!', 'Incorrect combination. Try again!'),
        duration: 3,
      });
    }

    setState((prev) => {
      const copy = deepCopy(prev);
      copy.latestAttempt = Date.now();
      copy.guesses.push(newGuessString);

      if (isCorrect) {
        copy.win = true;
      } else {
        copy.hearts -= 1;
      }

      return copy;
    });
  };

  // CONDITIONS
  const isWin = state.win;
  const isLose = state.hearts <= 0;
  const isComplete = isWin || isLose;

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isWin || isLose || isComplete);

  const isReady = state.selection.filter(Boolean).length === data.requests.length;

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    selection: state.selection,
    latestAttempt: state.latestAttempt,
    slotIndex: state.slotIndex,
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
