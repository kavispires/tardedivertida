import { chunk, cloneDeep } from 'lodash';
import { useEffect } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Pages
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useMarkAsPlayed } from 'pages/Daily/hooks/useDailyPlayTracker';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { vibrate } from 'pages/Daily/utils/vibrate';
// Internal
import { smartShuffle as smartShuffleHelper } from './helpers';
import { SETTINGS } from './settings';
import type { DailyPalavreadoEntry, GameState, PalavreadoLetter, SessionState } from './types';

export function usePalavreadoEngine(data: DailyPalavreadoEntry, initialState: GameState) {
  const size = data.keyword.length;
  const { translate } = useLanguage();
  const { state, setState } = useDailyGameState<GameState>(initialState);
  const { session, updateSession } = useDailySessionState<SessionState>({
    swap: [],
    selection: null,
    latestAttempt: 0,
    latestCorrectLettersCount: 0,
    scoringMessage: '',
    letterScore: 0,
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

  const swapLetters = (indexA: number, indexB: number) => {
    // 1. Run side effects OUTSIDE the state setter function
    playSFX('swap');

    updateSession({
      selection: null,
      swap: [indexA, indexB],
    });

    // 2. Keep the state setter strictly pure (only calculating the new state)
    setState((prev) => {
      const copyLetters = cloneDeep(prev.letters);
      const temp = copyLetters[indexA];
      copyLetters[indexA] = copyLetters[indexB];
      copyLetters[indexB] = temp;

      return {
        ...prev,
        letters: copyLetters,
        swaps: prev.swaps + 1,
      };
    });
  };

  const smartShuffle = () => {
    if (state.hearts <= 1 || state.usedSmartShuffle) {
      return;
    }

    setState((prev) => {
      const shuffledLetters = smartShuffleHelper(prev.letters, prev.guesses, size);
      playSFX('shuffle');

      return {
        ...prev,
        letters: shuffledLetters,
        usedSmartShuffle: true,
      };
    });

    updateSession({
      selection: null,
      swap: [],
    });
  };

  const submitGrid = () => {
    const answer = data.words.join('');

    setState((prev) => {
      const scoreBase = prev.hearts;
      let letterScore = 0;
      let latestCorrectLettersCount = 0;
      let correctWordsScore = 0;
      let secretWordsScore = 0;
      let winScore = 0;
      // Evaluate letters and mark any correct letter as correct and locked
      const copyLetters = cloneDeep(state.letters);
      // Save original state to check if words were already correct
      const originalLetters = cloneDeep(state.letters);
      copyLetters.map((letter, index) => {
        if (letter.state === 'idle' && letter.letter === answer[index]) {
          letter.state = String(Math.floor(index / size)) as PalavreadoLetter['state'];
          letter.locked = true;
          letterScore += scoreBase;
          latestCorrectLettersCount += 1;
        }
        return letter;
      });

      // Generate the guessed words from the letter
      const generatedWords = chunk(copyLetters, size).map((lg) => lg.map((l) => l.letter).join(''));

      // Check if any generated word is in the scoring words list and add points accordingly
      const extraWordsFound: string[] = [];
      generatedWords.forEach((word) => {
        if (data.scoringWords.includes(word)) {
          secretWordsScore += SETTINGS.SECRET_WORD_SCORE; // Add 20 points for each valid word found
          extraWordsFound.push(word);
        }
      });

      // Evaluate if any of the words match the words in the data
      const correctWords: string[] = [];
      generatedWords.forEach((word, wordIndex) => {
        if (data.words[wordIndex] === word) {
          // Check if this word was already fully correct before this attempt
          const wordStartIndex = wordIndex * size;
          const wasAlreadyCorrect = Array.from({ length: size }, (_, i) => wordStartIndex + i).every(
            (i) => originalLetters[i].locked,
          );

          word.split('').forEach((_, i) => {
            copyLetters[wordIndex * size + i].state = String(wordIndex) as PalavreadoLetter['state'];
            copyLetters[wordIndex * size + i].locked = true;
          });

          // Only award points if the word wasn't already correct
          if (!wasAlreadyCorrect) {
            correctWords.push(word);
            correctWordsScore += SETTINGS.WORD_SCORE; // Add 10 points for each correct word found
          }
        }
      });

      const isAllCorrect = copyLetters.every((letter) => letter.locked);

      if (isAllCorrect) {
        winScore -= prev.swaps; // Subtract the number of swaps from the score

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
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
      }
      if (updatedHearts === 0) {
        winScore -= prev.swaps;
        newStatus = STATUSES.LOSE;
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
      }

      let scoringMessage = '';
      const totalScore = letterScore + correctWordsScore + secretWordsScore + winScore;

      if (correctWords.length > 0) {
        scoringMessage += `${translate({
          en: `Correct Words: ${correctWords.map((w) => w.toLocaleUpperCase()).join(', ')} (+ ${correctWordsScore} points)\n`,
          pt: `Palavras corretas: ${correctWords.map((w) => w.toLocaleUpperCase()).join(', ')} (+ ${correctWordsScore} pontos)\n`,
        })}`;
      }

      if (extraWordsFound.length > 0) {
        scoringMessage += `${translate({
          en: `Extra Words: ${extraWordsFound.map((w) => w.toLocaleUpperCase()).join(', ')} (+ ${secretWordsScore} points)\n`,
          pt: `Palavras extras: ${extraWordsFound.map((w) => w.toLocaleUpperCase()).join(', ')} (+ ${secretWordsScore} pontos)\n`,
        })}`;
      }

      updateSession({
        selection: null,
        swap: [],
        latestCorrectLettersCount,
        scoringMessage,
        letterScore,
      });

      return {
        ...prev,
        guesses: [...prev.guesses, guesses],
        boardState: [...prev.boardState, newBoardState],
        letters: copyLetters,
        hearts: updatedHearts,
        score: prev.score + totalScore,
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
    usedSmartShuffle: state.usedSmartShuffle,
    selection: session.selection,
    swap: session.swap,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitGrid,
    smartShuffle,
    keyword: data.keyword,
    size,
    words: data.words,
    swapLetters,
    score: state.score,
    scoringMessage: session.scoringMessage,
    letterScore: session.letterScore,
    latestCorrectLettersCount: session.latestCorrectLettersCount,
  };
}
