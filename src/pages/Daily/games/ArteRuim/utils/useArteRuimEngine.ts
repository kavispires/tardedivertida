import { useEffect } from 'react';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Pages
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { DailyArteRuimEntry, GameState } from './types';

export function useArteRuimEngine(data: DailyArteRuimEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);

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
  const guessLetter = (letter: string) => {
    // Ignore previously guessed letters
    if (state.guesses[letter]) {
      return;
    }

    const isCorrect = state.solution[letter] !== undefined;

    const solution = { ...state.solution };
    if (isCorrect) {
      solution[letter] = true;
    }

    const win = Object.values(solution)
      .filter((value) => value !== undefined)
      .every(Boolean);

    let updatedStatus = state.status;
    if (isCorrect) {
      if (win) {
        playSFX('win');
        updatedStatus = STATUSES.WIN;
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
      } else {
        playSFX('addCorrect');
      }
    } else {
      if (state.hearts === 1) {
        playSFX('lose');
        updatedStatus = STATUSES.LOSE;
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
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
      status: updatedStatus,
    }));
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
