import { chunk, cloneDeep } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';

import { parseLetters } from './helpers';
import { SETTINGS } from './settings';
import { DailyPalavreadoEntry, PalavreadoLetter, PalavreadoLocalToday } from './types';

type GameState = {
  hearts: number;
  selection: number | null; // indexes of letters
  swap: number[]; // indexes of letters
  letters: PalavreadoLetter[];
  guesses: string[][]; // words guesses per heart
  state: string;
  swaps: number;
};

const defaultArteRuimLocalToday: PalavreadoLocalToday = {
  id: '',
  guesses: [],
  number: 0,
  swaps: 0,
};

export function usePalavreadoEngine(data: DailyPalavreadoEntry) {
  const { state, setState, updateState } = useDailyGameState<GameState>({
    selection: null,
    swap: [],
    letters: parseLetters(data.letters),
    guesses: [],
    hearts: SETTINGS.HEARTS,
    state: '',
    swaps: 0,
  });

  const { updateLocalStorage } = useDailyLocalToday<PalavreadoLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultArteRuimLocalToday,
    onApplyLocalState: (value) => {
      const hearts = SETTINGS.HEARTS - value.guesses.length;

      // Apply state if there are any guesses
      const latestGuess = value.guesses[value.guesses.length - 1];
      const copyLetters = cloneDeep(state.letters);
      const answer = data.words.join('');
      if (latestGuess) {
        const guessedLetters = latestGuess.map((w) => w.split('')).flat();
        copyLetters.forEach((letter, index) => {
          letter.letter = guessedLetters[index];

          if (letter.state === 'idle' && letter.letter === answer[index]) {
            letter.state = String(Math.floor(index / 4)) as PalavreadoLetter['state'];
            letter.locked = true;
          }

          return letter;
        });
      }

      updateState({
        hearts,
        guesses: value.guesses,
        letters: copyLetters,
        swaps: value.swaps ?? 0,
      });
    },
  });

  // ACTIONS
  const selectLetter = (index: number) => {
    if (state.selection === index) {
      updateState({
        selection: null,
        swap: [],
      });
      return;
    }

    if (state.selection === null) {
      updateState({
        selection: index,
        swap: [],
      });
      return;
    }

    setState((prev) => {
      const copyLetters = cloneDeep(state.letters);
      const temp = copyLetters[prev.selection!];
      copyLetters[prev.selection!] = copyLetters[index];
      copyLetters[index] = temp;

      updateLocalStorage({
        swaps: prev.swaps + 1,
      });

      return {
        ...prev,
        letters: copyLetters,
        selection: null,
        swap: [prev.selection!, index],
        swaps: prev.swaps + 1,
      };
    });
  };

  const submitGrid = () => {
    const answer = data.words.join('');

    setState((prev) => {
      // Evaluate letters and mark any correct letter as correct and locked
      const copyLetters = cloneDeep(state.letters);
      copyLetters.map((letter, index) => {
        if (letter.state === 'idle' && letter.letter === answer[index]) {
          letter.state = String(Math.floor(index / 4)) as PalavreadoLetter['state'];
          letter.locked = true;
        }
        return letter;
      });

      // Generate the guessed words from the letter
      const generatedWords = chunk(copyLetters, 4).map((lg) => lg.map((l) => l.letter).join(''));

      // Evaluate if any of the words match the words in the data
      generatedWords.forEach((word, wordIndex) => {
        if (data.words[wordIndex] === word) {
          word.split('').forEach((_, i) => {
            copyLetters[wordIndex * 4 + i].state = String(wordIndex) as PalavreadoLetter['state'];
            copyLetters[wordIndex * 4 + i].locked = true;
          });
        }
      });

      const isAllCorrect = copyLetters.every((letter) => letter.locked);

      const guesses = generatedWords;
      updateLocalStorage({
        guesses: [...state.guesses, guesses],
        swaps: prev.swaps,
      });

      return {
        ...prev,
        guesses: [...prev.guesses, guesses],
        letters: copyLetters,
        selection: null,
        swap: [],
        hearts: isAllCorrect ? prev.hearts : prev.hearts - 1,
      };
    });
  };

  // CONDITIONS
  const isWin = Object.values(state.letters).every((l) => l.locked);
  const isLose = state.hearts <= 0;
  const isComplete = isWin || isLose;

  // RESULTS MODAL
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    letters: state.letters,
    selection: state.selection,
    swap: state.swap,
    swaps: state.swaps,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitGrid,
  };
}
