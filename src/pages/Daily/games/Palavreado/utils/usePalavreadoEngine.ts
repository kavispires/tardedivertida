import { chunk, cloneDeep } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
import { useEffect } from 'react';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Internal
import { SETTINGS } from './settings';
import type { DailyPalavreadoEntry, GameState, PalavreadoLetter, SessionState } from './types';

export function usePalavreadoEngine(data: DailyPalavreadoEntry, initialState: GameState) {
  const size = data.keyword.length;
  const { state, setState } = useDailyGameState<GameState>(initialState);
  const { session, updateSession } = useDailySessionState<SessionState>({
    swap: [],
    selection: null,
    latestAttempt: 0,
  });

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is important
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  // ACTIONS
  const selectLetter = (index: number) => {
    if (session.selection === index) {
      updateSession({
        selection: null,
        swap: [],
      });
      playSFX('bubbleOut');
      return;
    }

    if (session.selection === null) {
      updateSession({
        selection: index,
        swap: [],
      });
      playSFX('select');
      return;
    }

    setState((prev) => {
      if (session.selection === null) {
        return prev;
      }
      playSFX('swap');
      const copyLetters = cloneDeep(state.letters);
      const temp = copyLetters[session.selection];
      copyLetters[session.selection] = copyLetters[index];
      copyLetters[index] = temp;

      updateSession({
        selection: null,
        swap: [session.selection, index],
      });

      return {
        ...prev,
        letters: copyLetters,
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

      if (isAllCorrect) {
        playSFX('win');
      } else {
        playSFX('wrong');
        vibrate('wrong');
      }

      const updatedHearts = isAllCorrect ? prev.hearts : prev.hearts - 1;
      const guesses = generatedWords;
      const newBoardState = copyLetters.map((l) => l.letter);

      let newStatus = prev.status;
      if (isAllCorrect) {
        newStatus = STATUSES.WIN;
        logAnalyticsEvent(`daily_${SETTINGS.KEY}_win`);
      }
      if (updatedHearts === 0) {
        newStatus = STATUSES.LOSE;
        logAnalyticsEvent(`daily_${SETTINGS.KEY}_lose`);
      }

      updateSession({
        selection: null,
        swap: [],
      });

      return {
        ...prev,
        guesses: [...prev.guesses, guesses],
        boardState: [...prev.boardState, newBoardState],
        letters: copyLetters,
        hearts: updatedHearts,
        status: newStatus,
      };
    });
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
  const { showResultModal, setShowResultModal } = useShowResultModal(isComplete);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    letters: state.letters,
    swaps: state.swaps,
    selection: session.selection,
    swap: session.swap,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitGrid,
    keyword: data.keyword,
    size,
    words: data.words,
  };
}
