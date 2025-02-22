import { cloneDeep } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
// Internal
import { SETTINGS } from './settings';
import type { DailyTaNaCaraEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  played: false,
};

export const getInitialState = (data: DailyTaNaCaraEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: cloneDeep(DEFAULT_LOCAL_TODAY),
  });

  return {
    id: data.id,
    number: data.number,
    played: localToday.played,
  };
};
