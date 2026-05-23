import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
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
import type { DailyPirralhosEntry, GameState } from './types';

export function usePirralhosEngine(data: DailyPirralhosEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);
  const { message } = App.useApp();
  const { translate } = useLanguage();

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
  const submitKid = (kidId: string): boolean => {
    if (state.guesses.includes(kidId)) {
      playSFX('wrong');
      message.warning({
        content: translate({
          pt: 'Você já acusou esse pirralho e não foi ele(a)!',
          en: 'You have already accused this kid and it was not them!',
        }),
        duration: 5,
      });

      return false;
    }

    const isCulprit = data.culpritsIds.includes(kidId);
    const newGuesses = [...state.guesses, kidId];

    if (!isCulprit) {
      message.warning({
        content: translate({
          pt: 'Esse pirralho não é um dos culpados!',
          en: 'This kid is not one of the culprits!',
        }),
        duration: 5,
      });

      const newHearts = state.hearts - 1;

      if (newHearts <= 0) {
        playSFX('lose');
        logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
        setState((prevState) => ({
          ...prevState,
          guesses: newGuesses,
          hearts: newHearts,
          status: STATUSES.LOSE,
        }));
        return false;
      }

      playSFX('wrong');
      setState((prevState) => ({
        ...prevState,
        hearts: newHearts,
        guesses: newGuesses,
        status: newHearts <= 0 ? STATUSES.LOSE : prevState.status,
      }));

      return true;
    }

    if (isCulprit) {
      const allCulpritsGuessed = data.culpritsIds.every((culpritId) => newGuesses.includes(culpritId));

      playSFX('win');

      setState((prevState) => ({
        ...prevState,
        guesses: newGuesses,
        status: allCulpritsGuessed ? STATUSES.WIN : prevState.status,
      }));
    }
    return true;
  };

  const assessKid = (kidId: string) => {
    const assessmentOrder = ['innocent', 'liar', 'culprit', 'unknown'] as const;
    setState((prevState) => {
      const currentAssessment = prevState.assessments[kidId];
      const currentIndex = assessmentOrder.indexOf(currentAssessment);
      const nextIndex = (currentIndex + 1) % assessmentOrder.length;
      const nextAssessment = assessmentOrder[nextIndex];

      return {
        ...prevState,
        assessments: {
          ...prevState.assessments,
          [kidId]: nextAssessment,
        },
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
  const { showResultModal, setShowResultModal } = useShowResultModal(isWin || isLose || isComplete);

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    kids: data.kids,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    submitKid,
    assessKid,
    assessments: state.assessments,
  };
}
