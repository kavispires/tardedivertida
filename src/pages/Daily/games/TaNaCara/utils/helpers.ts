import { cloneDeep } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { removeDuplicates } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { DailyTaNaCaraEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  played: false,
  suspectsIds: [],
};

export const getInitialState = (data: DailyTaNaCaraEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: cloneDeep(DEFAULT_LOCAL_TODAY),
  });

  const suspectsIds = data.suspectsIds ?? [];

  return {
    id: data.id,
    number: data.number,
    played: localToday.played,
    suspectsIds: removeDuplicates(suspectsIds),
  };
};
