import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday, useMarkAsPlayed } from 'pages/Daily/hooks/useDailyLocalToday';
import { useDailySaveDrawings } from 'pages/Daily/hooks/useDailySave';
import { wait } from 'pages/Daily/utils';
// Types
import type { Me } from 'types/user';
// Utils
import { SEPARATOR } from 'utils/constants';
import { removeDuplicates } from 'utils/helpers';
// Internal
import { DEFAULT_LOCAL_TODAY } from './helpers';
import { SETTINGS } from './settings';
import type { PicacoLocalToday, DailyPicacoEntry, DrawingToSave, GameState } from './types';

export function usePicacoEngine(data: DailyPicacoEntry, currentUser: Me, initialState: GameState) {
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);

  const { updateLocalStorage } = useDailyLocalToday<PicacoLocalToday>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: DEFAULT_LOCAL_TODAY,
  });

  const card = state.cards[state.cardIndex];

  const onStart = () => updateState({ screen: 'playing' });

  const onNextCard = async (drawing: CanvasLine[]) => {
    if (state.cardIndex < state.cards.length - 1) {
      return setState((prev) => ({
        ...prev,
        drawings: [...prev.drawings, JSON.stringify(drawing)],
        cardIndex: prev.cardIndex + 1,
      }));
    }

    if (state.cardIndex === state.cards.length - 1) {
      updateState({ screen: 'saving' });

      // SAVE
      await wait(1000);

      onSaveDrawings({
        ...state,
        drawings: removeDuplicates([...state.drawings, JSON.stringify(drawing)]),
        screen: 'saving',
      });
    }
  };

  const mutation = useDailySaveDrawings(() => {
    updateLocalStorage({ played: true });
    updateState({ played: true, screen: 'idle' });
  });

  useMarkAsPlayed({
    key: SETTINGS.KEY,
    isComplete: state.played,
  });

  const onSaveDrawings = (stateToSave: GameState) => {
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
    cardNumber: state.cardIndex + 1,
    card,
    isPlaying: state.screen === 'playing',
    isIdle: state.screen === 'idle',
    isSaving: state.screen === 'saving' || mutation.isPending,
    alreadyPlayed: state.played,
    onStart,
    onNextCard,
  };
}
