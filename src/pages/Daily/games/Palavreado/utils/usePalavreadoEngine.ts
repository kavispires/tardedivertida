import { chunk, cloneDeep } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
// Internal
import { DEFAULT_LOCAL_TODAY } from './helpers';
import { SETTINGS } from './settings';
import type { DailyPalavreadoEntry, GameState, PalavreadoLetter, PalavreadoLocalToday } from './types';

export function usePalavreadoEngine(data: DailyPalavreadoEntry, initialState: GameState) {
  const size = data.keyword.length;
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<PalavreadoLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
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
      if (prev.selection === null) {
        return prev;
      }

      const copyLetters = cloneDeep(state.letters);
      const temp = copyLetters[prev.selection];
      copyLetters[prev.selection] = copyLetters[index];
      copyLetters[index] = temp;

      updateLocalStorage({
        swaps: prev.swaps + 1,
      });

      return {
        ...prev,
        letters: copyLetters,
        selection: null,
        swap: [prev.selection, index],
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
          letter.state = String(Math.floor(index / size)) as PalavreadoLetter['state'];
          letter.locked = true;
        }
        return letter;
      });

      // Generate the guessed words from the letter
      const generatedWords = chunk(copyLetters, size).map((lg) => lg.map((l) => l.letter).join(''));

      // Evaluate if any of the words match the words in the data
      generatedWords.forEach((word, wordIndex) => {
        if (data.words[wordIndex] === word) {
          word.split('').forEach((_, i) => {
            copyLetters[wordIndex * size + i].state = String(wordIndex) as PalavreadoLetter['state'];
            copyLetters[wordIndex * size + i].locked = true;
          });
        }
      });

      const isAllCorrect = copyLetters.every((letter) => letter.locked);

      const guesses = generatedWords;
      const newBoardState = copyLetters.map((l) => l.letter);

      updateLocalStorage({
        boardState: [...state.boardState, newBoardState],
        swaps: prev.swaps,
      });

      return {
        ...prev,
        guesses: [...prev.guesses, guesses],
        boardState: [...prev.boardState, newBoardState],
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

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete,
  });

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
    keyword: data.keyword,
    size,
  };
}
