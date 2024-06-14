import { sampleSize } from 'lodash';
import { useDailyGameState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { useDailySaveDrawings } from 'pages/Daily/hooks/useDailySaveDrawings';
import { wait } from 'pages/Daily/utils';
import { ArteRuimCard } from 'types/tdr';
import { Me } from 'types/user';
import { SEPARATOR } from 'utils/constants';
import { removeDuplicates } from 'utils/helpers';

import { SETTINGS } from './settings';
import { ArtistaLocalToday, DailyArtistaEntry, DrawingToSave } from './types';

type GameState = {
  cards: ArteRuimCard[];
  drawings: string[];
  cardIndex: number;
  played: boolean;
  screen: 'idle' | 'playing' | 'saving';
};

const defaultLocalToday: ArtistaLocalToday = {
  id: '',
  number: 0,
  played: false,
};

export function useArtistaEngine(data: DailyArtistaEntry, currentUser: Me) {
  const { state, setState, updateState } = useDailyGameState<GameState>({
    cards: sampleSize(data.cards, SETTINGS.DRAWINGS),
    drawings: [],
    cardIndex: 0,
    played: false,
    screen: 'idle',
  });

  const { updateLocalStorage } = useDailyLocalToday<ArtistaLocalToday>({
    key: SETTINGS.LOCAL_TODAY_KEY,
    gameId: data.id,
    challengeNumber: data.number ?? 0,
    defaultValue: defaultLocalToday,
    onApplyLocalState: (value) => {
      if (value.played) {
        updateState({
          played: value.played,
        });
      }
    },
  });

  const card = state.cards[state.cardIndex];

  const onStart = () => updateState({ screen: 'playing' });

  const onNextCard = async (drawing: any) => {
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
