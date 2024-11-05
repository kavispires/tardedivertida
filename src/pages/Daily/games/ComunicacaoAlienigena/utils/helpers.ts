import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import { ComunicacaoAlienigenaLocalToday, DailyComunicacaoAlienigenaEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: ComunicacaoAlienigenaLocalToday = {
  id: '',
  guesses: [],
  number: 0,
};

export const getInitialState = (data: DailyComunicacaoAlienigenaEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    hearts: SETTINGS.HEARTS,
    guesses: [],
    selection: [null, null, null, null],
    latestAttempt: null,
    win: false,
  };

  if (localToday) {
    state.hearts = SETTINGS.HEARTS - localToday.guesses.length;
    state.guesses = localToday.guesses;
  }

  return state;
};
