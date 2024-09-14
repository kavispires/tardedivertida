import { sampleSize } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import { PicacoLocalToday, DailyPicacoEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: PicacoLocalToday = {
  id: '',
  number: 0,
  played: false,
};

export const getInitialState = (data: DailyPicacoEntry): GameState => {
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
