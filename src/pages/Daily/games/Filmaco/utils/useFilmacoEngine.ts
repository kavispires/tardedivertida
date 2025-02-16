import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Utils
import { removeDuplicates } from 'utils/helpers';
// Internal
import { DEFAULT_LOCAL_TODAY } from './helpers';
import { SETTINGS } from './settings';
import type { DailyFilmacoEntry, FilmacoLocalToday, GameState } from './types';

export function useFilmacoEngine(data: DailyFilmacoEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);

  const { localToday, updateLocalStorage } = useDailyLocalToday<FilmacoLocalToday>({
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

    const win = Object.values(solution)
      .filter((value) => value !== undefined)
      .every(Boolean);

    if (isCorrect) {
      if (win) {
        playSFX('win');
      } else {
        playSFX('addCorrect');
      }
    } else {
      if (state.hearts === 1) {
        playSFX('lose');
      } else {
        playSFX('addWrong');
      }
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
