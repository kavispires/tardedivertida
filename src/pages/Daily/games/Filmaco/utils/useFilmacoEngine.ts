import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalTodayV2, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { removeDuplicates } from 'utils/helpers';

import { DEFAULT_LOCAL_TODAY } from './helpers';
import { SETTINGS } from './settings';
import { DailyFilmacoEntry, FilmacoLocalToday, GameState } from './types';

export function useFilmacoEngine(data: DailyFilmacoEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);

  const { localToday, updateLocalStorage } = useDailyLocalTodayV2<FilmacoLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });
  // ACTIONS
  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (state.guesses[letter]) {
      return;
    }

    const isCorrect = state.solution[letter] !== undefined;

    updateLocalStorage({
      letters: removeDuplicates([...(localToday?.letters ?? []), letter]),
    });

    const solution = { ...state.solution };
    if (isCorrect) {
      solution[letter] = true;
    }

    setState((prev) => ({
      ...prev,
      guesses: {
        ...prev.guesses,
        [letter]: {
          letter: letter,
          state: isCorrect ? 'correct' : 'incorrect',
          disabled: true,
        },
      },
      solution,
      hearts: isCorrect ? prev.hearts : prev.hearts - 1,
    }));
  };

  // CONDITIONS
  const isWin = Object.values(state.solution)
    .filter((value) => value !== undefined)
    .every(Boolean);
  const isLose = state.hearts <= 0;
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
    solution: state.solution,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    guessLetter,
  };
}
