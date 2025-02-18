import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { QuartetosLocalToday, DailyQuartetosEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: QuartetosLocalToday = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  matches: [],
  guesses: [],
  grid: [],
  completeSets: [],
};

export const getInitialState = (data: DailyQuartetosEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const useInitialGrid = localToday.grid.length === 0 && localToday.completeSets.length === 0;

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    matches: localToday.matches,
    guesses: localToday.guesses,
    grid: useInitialGrid ? data.grid : localToday.grid,
    completeSets: localToday.completeSets,
  };

  return state;
};
