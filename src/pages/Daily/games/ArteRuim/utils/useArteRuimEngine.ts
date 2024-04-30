import { useEffect, useState } from 'react';
import { SETTINGS } from './settings';
import { ArteRuimLocalToday, DailyArteRuimEntry } from './types';
import { LettersDictionary } from 'pages/Daily/utils/types';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { removeDuplicates } from 'utils/helpers';
import { getLettersInWord } from './helpers';

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
  const [state, setState] = useState<GameState>({
    solution: getLettersInWord(data.text),
    hearts: SETTINGS.HEARTS,
    guesses: {},
  });

  const { localToday, updateLocalStorage } = useDailyLocalToday<ArteRuimLocalToday>({
    key: SETTINGS.TD_DAILY_ARTE_RUIM_LOCAL_TODAY,
    gameId: data.id,
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

      setState((prev) => ({
        ...prev,
        guesses,
        hearts,
        solution,
      }));
    },
  });

  const [showResultModal, setShowResultModal] = useState(false);

  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (state.guesses[letter]) {
      return;
    }

    const isCorrect = state.solution[letter] !== undefined;

    updateLocalStorage({
      letters: removeDuplicates([...(localToday?.letters ?? []), letter]),
    });

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
      solution: {
        ...prev.solution,
        [letter]: isCorrect,
      },
      hearts: isCorrect ? prev.hearts : prev.hearts - 1,
    }));
  };

  const isWin = Object.values(state.solution).every(Boolean);
  const isLose = state.hearts <= 0;
  const isComplete = isWin || isLose;

  // Controls auto result modal
  useEffect(() => {
    if (isComplete) {
      setShowResultModal(true);
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

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
