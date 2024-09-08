import { chunk, cloneDeep } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { useEffect } from 'react';

import { parseLetters } from './helpers';
import { SETTINGS } from './settings';
import { DailyPalavreadoEntry, GameState, PalavreadoLetter, PalavreadoLocalToday } from './types';

const defaultArteRuimLocalToday: PalavreadoLocalToday = {
  id: '',
  boardState: [],
  number: 0,
  swaps: 0,
};

export function usePalavreadoEngine(data: DailyPalavreadoEntry) {
  const size = data.keyword.length;
  const { state, setState, updateState } = useDailyGameState<GameState>({
    selection: null,
    swap: [],
    letters: parseLetters(data.letters, size),
    boardState: [],
    guesses: [],
    hearts: Math.max(SETTINGS.HEARTS, size),
    state: '',
    swaps: 0,
  });

  const { updateLocalStorage } = useDailyLocalToday<PalavreadoLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultArteRuimLocalToday,
    onApplyLocalState: (value) => {
      const hearts = Math.max(SETTINGS.HEARTS, size) - value.boardState.length;

      // Read state of the board and apply guesses
      const lsGuesses = (value.boardState ?? []).map((board) => {
        const guess = chunk(board, size);
        return guess.map((g) => g.join(''));
      });

      // Apply latest board state
      const latestBoardState = value.boardState[value.boardState.length - 1];
      const copyLetters = cloneDeep(state.letters);
      const answer = data.words.join('');
      if (latestBoardState) {
        copyLetters.forEach((letter, index) => {
          letter.letter = latestBoardState[index];

          if (letter.state === 'idle' && letter.letter === answer[index]) {
            letter.state = String(Math.floor(index / size)) as PalavreadoLetter['state'];
            letter.locked = true;
          }

          return letter;
        });
      }

      updateState({
        hearts,
        guesses: lsGuesses,
        letters: copyLetters,
        boardState: value.boardState ?? [],
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

  useEffect(() => {
    if (isComplete) {
      updateLocalStorage({
        status: 'played',
      });
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

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
