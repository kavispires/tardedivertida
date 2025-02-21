import { difference, orderBy, shuffle } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import type { QuartetosLocalToday, DailyQuartetosEntry, GameState, SessionState } from './types';
import { SETTINGS } from './settings';

export function useQuartetosEngine(data: DailyQuartetosEntry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);
  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    selection: [],
    latestAttempt: 0,
  });

  const { updateLocalStorage } = useDailyLocalToday<QuartetosLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  // ACTIONS
  const onSelectItem = (itemId: string) => {
    if (state.status !== STATUSES.IN_PROGRESS) {
      return;
    }

    if (!session.selection.includes(itemId) && session.selection.length === 4) {
      message.info(translate('Você sô pode selecionar 4 de cada vez', 'You can only select 4 at a time'));
      return;
    }

    setSession((prev) => {
      const copy = deepCopy(prev);
      const index = copy.selection.indexOf(itemId);
      if (index > -1) {
        playSFX('bubbleIn');
        copy.selection = copy.selection.filter((id) => id !== itemId);
      } else {
        playSFX('bubbleOut');
        copy.selection.push(itemId);
      }
      return copy;
    });
  };

  const onDeselectAll = () => {
    updateSession({ selection: [] });
    playSFX('bubbleOut');
  };

  const onShuffle = () => {
    updateState({ grid: shuffle(data.grid) });
    playSFX('shuffle');
  };

  const onSubmit = () => {
    // Verify guess
    const guessId = session.selection.join('-');

    if (state.guesses.includes(guessId)) {
      message.info(translate('Você já tentou essa combinação', 'You already tried this combination'));
      return;
    }

    const selectionId = orderBy(session.selection, (o) => Number(o)).join('-');

    // If it matches one of the sets
    const isCorrect = data.sets.find((set) => set.id === selectionId);

    setState((prev) => {
      const copy = deepCopy(prev);

      const guesses = [...copy.guesses, guessId];

      const grid = isCorrect ? difference(copy.grid, session.selection) : copy.grid;
      const matches = isCorrect ? [...copy.matches, isCorrect] : copy.matches;

      const hearts = isCorrect ? copy.hearts : copy.hearts - 1;

      // Update if lose
      let status = hearts <= 0 ? STATUSES.LOSE : copy.status;
      // Update if win
      status = matches.length === data.sets.length ? STATUSES.WIN : status;

      return {
        ...copy,
        guesses,
        grid,
        matches,
        hearts,
        status,
      };
    });

    if (isCorrect) {
      playSFX('correct');
      updateSession({ selection: [] });
    } else {
      playSFX('wrong');
      updateSession({ latestAttempt: Date.now() });
    }
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
    guesses: state.guesses,
    grid: state.grid,
    matches: state.matches,
    selection: session.selection,
    latestAttempt: session.latestAttempt,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onSelectItem,
    onDeselectAll,
    onShuffle,
    onSubmit,
  };
}
