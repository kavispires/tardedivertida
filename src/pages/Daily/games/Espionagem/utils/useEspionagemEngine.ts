import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useShowResultModal } from 'pages/Daily/hooks/useShowResultModal';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
import { useEffect, useMemo } from 'react';
// Internal
import { SETTINGS } from './settings';
import type { DailyEspionagemEntry, GameState, SessionState } from './types';

export function useEspionagemEngine(data: DailyEspionagemEntry, initialState: GameState) {
  const { state, setState } = useDailyGameState<GameState>(initialState);

  const { session, updateSession } = useDailySessionState<SessionState>({
    activeSuspectId: null,
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

  const onNeedClue = () => {
    if (state.hearts <= 0) return;

    setState((prev) => ({
      ...prev,
      hearts: prev.hearts - 1,
    }));
    playSFX('swap');
  };

  const onDeselectSuspect = () => {
    updateSession({ activeSuspectId: null });
  };

  const onSelectSuspect = (suspectId: string) => {
    playSFX('select');
    // If suspect is already released, do nothing
    if (state.released.includes(suspectId)) return;

    updateSession({ activeSuspectId: suspectId });
  };

  // ACTIONS
  const onRelease = () => {
    const suspectId = session.activeSuspectId;
    if (!suspectId) return;

    // Verify lose condition
    if (suspectId === data.culpritId) {
      setState((prev) => ({
        ...prev,
        status: STATUSES.LOSE,
        hearts: 0,
      }));
      playSFX('lose');
      updateSession({ activeSuspectId: null });
      return;
    }

    // Update state with released suspect
    setState((prev) => {
      const newReleased = [...prev.released, suspectId];
      if (newReleased.length === data.suspects.length - 1) {
        // If all suspects except the culprit are released, player wins
        playSFX('win');
        return {
          ...prev,
          status: STATUSES.WIN,
          released: newReleased,
        };
      }

      playSFX('addCorrect');
      return {
        ...prev,
        released: [...prev.released, suspectId],
      };
    });
    updateSession({ activeSuspectId: null });
  };

  const statementsCutoffLength = useMemo(() => {
    const livesUsed = SETTINGS.HEARTS - state.hearts;
    const initialLength = 1;
    const releasedBonus = Math.min(state.released.length, 2);

    return initialLength + livesUsed + releasedBonus;
  }, [state.hearts, state.released.length]);

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
    released: state.released,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onRelease,
    onSelectSuspect,
    onDeselectSuspect,
    activeSuspectId: session.activeSuspectId,
    statementsCutoffLength,
    onNeedClue,
  };
}
