import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { TaNaCaraLocalToday, DailyTaNaCaraEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: TaNaCaraLocalToday = {
  id: '',
  number: 0,
  played: false,
};

export const getInitialState = (data: DailyTaNaCaraEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  return {
    questionIndex: 0,
    testimonies: data.testimonies.filter((t) => !t.nsfw),
    answers: [
      {
        testimonyId: data.testimonies[0].testimonyId,
        related: [],
        unrelated: [...data.testimonies[0].suspectsIds],
      },
    ],
    selections: [],
    allowNSFW: false,
    played: localToday.played ?? false,
    screen: 'idle',
  };
};
