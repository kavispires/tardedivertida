import { sampleSize } from 'lodash';
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useDailySaveDrawings } from 'pages/Daily/hooks/useDailySave';
import { wait } from 'pages/Daily/utils';
import { useEffect } from 'react';
// Types
import type { Me } from 'types/user';
// Utils
import { SEPARATOR } from 'utils/constants';
import { removeDuplicates } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { DailyPicacoEntry, DrawingToSave, GameState, SessionState } from './types';

export function usePicacoEngine(data: DailyPicacoEntry, currentUser: Me, initialState: GameState) {
  const { state, updateState } = useDailyGameState<GameState>(initialState);
  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    cards: sampleSize(data.cards, SETTINGS.DRAWINGS),
    drawings: [],
    cardIndex: 0,
    screen: 'idle',
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

  const card = session.cards[session.cardIndex];

  const onStart = () => updateSession({ screen: 'playing' });

  const onNextCard = async (drawing: CanvasLine[]) => {
    if (session.cardIndex < session.cards.length - 1) {
      return setSession((prev) => ({
        ...prev,
        drawings: [...prev.drawings, JSON.stringify(drawing)],
        cardIndex: prev.cardIndex + 1,
      }));
    }

    if (session.cardIndex === session.cards.length - 1) {
      updateSession({ screen: 'saving' });

      // SAVE
      await wait(1000);

      onSaveDrawings({
        ...session,
        drawings: removeDuplicates([...session.drawings, JSON.stringify(drawing)]),
        screen: 'saving',
      });
    }
  };

  const mutation = useDailySaveDrawings(() => {
    updateState({ played: true });
    updateSession({ screen: 'idle' });
  });

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete: state.played,
  });

  const onSaveDrawings = (stateToSave: SessionState) => {
    const toSave = stateToSave.drawings.reduce((acc: Dictionary<DrawingToSave>, drawing, index) => {
      if (drawing.length > 50) {
        const card = stateToSave.cards[index];
        acc[`${card.id}${SEPARATOR}${Date.now()}`] = {
          drawing,
          cardId: card.id,
          level: card.level,
          playerId: currentUser.id,
          successRate: 0,
          text: card.text,
        };
      }

      return acc;
    }, {});

    mutation.mutate(toSave);
  };

  return {
    cardNumber: session.cardIndex + 1,
    card,
    isPlaying: session.screen === 'playing',
    isIdle: session.screen === 'idle',
    isSaving: session.screen === 'saving' || mutation.isPending,
    alreadyPlayed: state.played,
    onStart,
    onNextCard,
  };
}
