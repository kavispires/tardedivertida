import { cloneDeep, merge } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Internal
import { SETTINGS } from './settings';
import type { DailyTeoriaDeConjuntosEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  hearts: SETTINGS.HEARTS,
  status: STATUSES.IN_PROGRESS,
  hand: [],
  deck: [],
  rule1Things: [],
  rule2Things: [],
  intersectingThings: [],
  guesses: [],
};

export const getInitialState = (data: DailyTeoriaDeConjuntosEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      hand: data.things.slice(0, 4),
      deck: data.things.slice(4),
      rule1Things: [
        {
          id: data.rule1.thing.id,
          name: data.rule1.thing.name,
          rule: 1,
        },
      ],
      rule2Things: [
        {
          id: data.rule2.thing.id,
          name: data.rule2.thing.name,
          rule: 2,
        },
      ],
      intersectingThings: [
        {
          id: data.intersectingThing.id,
          name: data.intersectingThing.name,
        },
      ],
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    hearts: localToday.hearts,
    status: localToday.status,
    hand: localToday.hand,
    deck: localToday.deck,
    rule1Things: localToday.rule1Things,
    rule2Things: localToday.rule2Things,
    intersectingThings: localToday.intersectingThings,
    guesses: localToday.guesses,
  };

  return state;
};
