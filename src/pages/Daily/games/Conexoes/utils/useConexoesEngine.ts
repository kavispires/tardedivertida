import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Pages
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useMarkAsPlayed } from 'pages/Daily/hooks/useDailyPlayTracker';
import { useDailySaveConexoes } from 'pages/Daily/hooks/useDailySave';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { DailyConexoesEntry, GameState, SessionState } from './types';
import { generatePairs } from './helpers';

export function useConexoesEngine(data: DailyConexoesEntry, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);

  const initialPairs = generatePairs(data.imageIds, new Set(), 20);

  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    pairs: initialPairs,
    currentPairIndex: 0,
    relatedPairs: [],
    evaluatedCount: 0,
    screen: 'idle',
    excludedPairIds: new Set(initialPairs.map((p) => p.pairId)),
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

  const currentPair = session.pairs[session.currentPairIndex];
  const hasAnyRelationships = session.relatedPairs.length > 0;
  const canSave = session.evaluatedCount >= SETTINGS.MIN_PAIRS;
  const canComplete = session.evaluatedCount >= SETTINGS.MIN_PAIRS && !hasAnyRelationships;
  const hasMorePairs = session.currentPairIndex < session.pairs.length - 1;

  const onStart = () => {
    updateSession({ screen: 'playing' });
  };

  const onEvaluatePair = (isRelated: boolean) => {
    if (!currentPair) return;

    playSFX(isRelated ? 'yah' : 'nah');

    setSession((prev) => {
      const copy = cloneDeep(prev);

      // If related, add the pair to relatedPairs
      if (isRelated) {
        copy.relatedPairs.push({
          imageId1: currentPair.imageId1,
          imageId2: currentPair.imageId2,
        });
      }

      // Increment evaluated count
      copy.evaluatedCount++;

      // Move to next pair or generate new pairs if needed
      if (copy.currentPairIndex < copy.pairs.length - 1) {
        copy.currentPairIndex++;
      } else {
        // Generate more pairs
        const newPairs = generatePairs(data.imageIds, copy.excludedPairIds, 20);
        if (newPairs.length > 0) {
          copy.pairs = [...copy.pairs, ...newPairs];
          copy.currentPairIndex++;
        }
      }

      return copy;
    });
  };

  const onSave = () => {
    if (!canSave || !hasAnyRelationships) return;

    updateSession({ screen: 'saving' });

    mutation.mutate({ pairs: session.relatedPairs });
  };

  const onComplete = () => {
    if (!canComplete) return;

    updateState({ played: true });
    updateSession({ screen: 'idle' });
    logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'played'));
  };

  const mutation = useDailySaveConexoes(() => {
    updateState({ played: true });
    updateSession({ screen: 'idle' });
    logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'played'));
  });

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete: state.played,
  });

  return {
    state,
    session,
    currentPair,
    canSave,
    canComplete,
    hasAnyRelationships,
    hasMorePairs,
    onStart,
    onEvaluatePair,
    onSave,
    onComplete,
    isSaving: mutation.isPending,
  };
}
