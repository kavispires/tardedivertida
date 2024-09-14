import { sampleSize } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { deepCopy } from 'utils/helpers';

import { SETTINGS } from './settings';
import { ArtistaLocalToday, DailyArtistaEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: ArtistaLocalToday = {
  id: '',
  number: 0,
  played: false,
};

export const getInitialState = (data: DailyArtistaEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  return {
    cards: sampleSize(data.cards, SETTINGS.DRAWINGS),
    drawings: [],
    cardIndex: 0,
    played: localToday.played ?? false,
    screen: 'idle',
  };
};
