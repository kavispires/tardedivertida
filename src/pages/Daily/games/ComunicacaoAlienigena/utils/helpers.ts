import { cloneDeep } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Internal
import { SETTINGS } from './settings';
import type { DailyComunicacaoAlienigenaEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  guesses: [],
  number: 0,
  hearts: SETTINGS.HEARTS,
  status: STATUSES.IN_PROGRESS,
};

export const getInitialState = (data: DailyComunicacaoAlienigenaEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: cloneDeep(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    guesses: localToday.guesses,
  };

  return state;
};
