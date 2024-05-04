import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { cloneDeep } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';

import { calculateGuessValue, orderLettersByWord, parseLetters } from './helpers';
import { SETTINGS } from './settings';
import { DailyPalavreadoEntry, PalavreadoLetter, PalavreadoLocalToday } from './type';

type GameState = {
  hearts: number;
  selection: number[]; // indexes of letters
  letters: PalavreadoLetter[];
  guesses: PalavreadoLetter[][];
  state: string;
  latestWord: string;
  previousWords: string[];
};

const defaultArteRuimLocalToday: PalavreadoLocalToday = {
  id: '',
  letters: [],
  number: 0,
};

export function usePalavreadoEngine(data: DailyPalavreadoEntry) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>({
    selection: [],
    letters: parseLetters(data.letters),
    guesses: [],
    hearts: SETTINGS.HEARTS,
    state: '',
    latestWord: '',
    previousWords: [],
  });

  const { localToday, updateLocalStorage } = useDailyLocalToday<PalavreadoLocalToday>({
    key: SETTINGS.TD_DAILY_PALAVREADO_LOCAL_TODAY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultArteRuimLocalToday,
    onApplyLocalState: (value) => {},
  });

  // ACTIONS
  const selectLetter = (index: number) => {
    if (state.selection.includes(index)) {
      return setState((prev) => ({
        ...prev,
        selection: prev.selection.filter((i) => i !== index),
        state: '',
      }));
    }

    if (state.selection.length >= SETTINGS.WORD_LENGTH) {
      message.info(
        translate(
          `Você já selecionou ${SETTINGS.WORD_LENGTH} letras`,
          `You have already selected ${SETTINGS.WORD_LENGTH} letters`
        )
      );
      return;
    }

    setState((prev) => ({
      ...prev,
      selection: [...prev.selection, index],
      state: '',
    }));

    // // Ignore previously guessed letters
    // if (state.guesses[letter]) {
    //   return;
    // }
    // const isCorrect = state.solution[letter] !== undefined;
    // // updateLocalStorage({
    // //   letters: removeDuplicates([...(localToday?.letters ?? []), letter]),
    // // });
    // setState((prev) => ({
    //   ...prev,
    //   guesses: {
    //     ...prev.guesses,
    //     [letter]: {
    //       letter: letter,
    //       state: isCorrect ? 'correct' : 'incorrect',
    //       disabled: true,
    //     },
    //   },
    //   solution: {
    //     ...prev.solution,
    //     [letter]: isCorrect,
    //   },
    //   hearts: isCorrect ? prev.hearts : prev.hearts - 1,
    // }));
  };

  const submitWord = () => {
    if (state.selection.length !== SETTINGS.WORD_LENGTH) {
      message.info(
        translate(
          `Selecione ${SETTINGS.WORD_LENGTH} letras para formar uma palavra`,
          `Select ${SETTINGS.WORD_LENGTH} letters to form a word`
        )
      );
      return;
    }
    const selectedWord = state.selection.map((index) => state.letters[index].letter).join('');

    if (state.previousWords.includes(selectedWord)) {
      message.info(translate('Você já tentou essa palavra', 'You have already tried this word'));
      updateState({
        selection: [],
      });
      return;
    }

    const wordIndex = data.words.indexOf(selectedWord);
    const lettersCopy = [...state.letters];

    // CORRECT
    if (wordIndex !== -1) {
      // Sanitize letters
      const previouslyCorrectLetters = lettersCopy.filter((letter) => letter.locked);
      const correctLetters = lettersCopy
        .filter((letter) => !letter.locked && state.selection.includes(letter.index))
        .map((letter) => ({
          ...letter,
          state: String(wordIndex) as PalavreadoLetter['state'],
          locked: true,
        }));

      const correctlyOrderedCorrectLetters = orderLettersByWord(correctLetters, data.words[wordIndex]);
      const guess = cloneDeep(correctlyOrderedCorrectLetters);

      const otherLetters = lettersCopy
        .filter((letter) => !letter.locked && !state.selection.includes(letter.index))
        .map((letter) => ({
          ...letter,
          state: letter.state === String(wordIndex) ? 'idle' : letter.state,
        }));
      const newLetters = [
        ...previouslyCorrectLetters,
        ...correctlyOrderedCorrectLetters,
        ...otherLetters,
      ].map((letter, index) => ({
        ...letter,
        index,
      }));
      updateState({
        letters: newLetters,
        guesses: [...state.guesses, guess],
        selection: [],
        state: 'correct',
        latestWord: selectedWord,
        previousWords: [...state.previousWords, selectedWord],
      });
      message.success(translate('Palavra correta!', 'Correct word!'));
      return;
    }

    // INCOMPLETE

    // Evaluate the word with the most guesses
    const guessValues = data.words.map((word) => calculateGuessValue(word, selectedWord));

    const maxGuessValue = Math.max(...guessValues);
    const maxGuessIndex = guessValues.indexOf(maxGuessValue);
    const bestGuess = data.words[maxGuessIndex];

    const guess: PalavreadoLetter[] = [];
    bestGuess.split('').forEach((letter, index) => {
      if (letter === selectedWord[index]) {
        lettersCopy[state.selection[index]].state = String(maxGuessIndex) as PalavreadoLetter['state'];
        guess.push(cloneDeep(lettersCopy[state.selection[index]]));
      } else {
        guess.push(cloneDeep(lettersCopy[state.selection[index]]));
      }
    });

    updateState({
      letters: lettersCopy,
      guesses: [...state.guesses, guess],
      selection: [],
      state: 'wrong',
      hearts: state.hearts - 1,
      latestWord: selectedWord,
      previousWords: [...state.previousWords, selectedWord],
    });
    message.error(translate('Palavra incorreta', 'Incorrect word'));
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
    latestWord: state.latestWord,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitWord,
  };
}
