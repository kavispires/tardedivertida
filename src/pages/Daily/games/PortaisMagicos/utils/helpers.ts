import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Utils
import { deepCopy, makeArray } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { PortaisMagicosLocalToday, DailyPortaisMagicosEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: PortaisMagicosLocalToday = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  currentCorridorIndex: 0,
  guesses: [[], [], []],
  currentCorridorIndexes: [],
};

export const getInitialState = (data: DailyPortaisMagicosEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    currentCorridorIndex: localToday.currentCorridorIndex,
    guesses: localToday.guesses,
    currentCorridorIndexes:
      localToday.currentCorridorIndexes.length > 0
        ? localToday.currentCorridorIndexes
        : makeArray(data.corridors[localToday.currentCorridorIndex].passcode.length).fill(1),
  };

  return state;
};
