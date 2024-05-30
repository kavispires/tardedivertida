import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { removeDuplicates } from 'utils/helpers';

import { getLettersInWord } from './helpers';
import { SETTINGS } from './settings';
import { ArteRuimLocalToday, DailyArteRuimEntry } from './types';

type GameState = {
  hearts: number;
  solution: BooleanDictionary;
  guesses: LettersDictionary;
};

const defaultArteRuimLocalToday: ArteRuimLocalToday = {
  id: '',
  letters: [],
  number: 0,
};

export function useArteRuimEngine(data: DailyArteRuimEntry) {
  const { state, setState, updateState } = useDailyGameState<GameState>({
    solution: getLettersInWord(data.text),
    hearts: SETTINGS.HEARTS,
    guesses: {},
  });

  const { localToday, updateLocalStorage } = useDailyLocalToday<ArteRuimLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultArteRuimLocalToday,
    onApplyLocalState: (value) => {
      let hearts = SETTINGS.HEARTS;
      let solution = { ...state.solution };
      const guesses = value.letters.reduce((acc: LettersDictionary, letter) => {
        const isCorrect = state.solution[letter] !== undefined;
        if (state.solution[letter] !== undefined) {
          solution = { ...solution, [letter]: true };
        }
        acc[letter] = {
          letter: letter,
          state: isCorrect ? 'correct' : 'incorrect',
          disabled: true,
        };
        hearts = isCorrect ? hearts : hearts - 1;
        return acc;
      }, {});

      updateState({
        guesses,
        hearts,
        solution,
      });
    },
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
