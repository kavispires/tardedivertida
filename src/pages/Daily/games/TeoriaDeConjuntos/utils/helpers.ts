import { cloneDeep, merge } from 'lodash';
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyTeoriaDeConjuntosEntry, GameState } from './types';
import { checkWeekend } from '../../AquiO/utils/helpers';

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
  isWeekend: false,
};

export const getInitialState = (data: DailyTeoriaDeConjuntosEntry): GameState => {
  const isWeekend = checkWeekend(data.id);

  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      hand: data.things.slice(0, isWeekend ? 5 : 4),
      hearts: SETTINGS.HEARTS + (isWeekend ? 1 : 0),
      deck: data.things.slice(isWeekend ? 5 : 4),
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
    isWeekend,
  };

  return state;
};

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  guesses,
  isWeekend,
  totalHearts,
  ...rest
}: BasicResultsOptions & {
  guesses: GameState['guesses'];
  isWeekend: boolean;
}) {
  const cleanUpAttempts = guesses.map((guess) => {
    return {
      1: '🟡',
      2: '🔴',
      0: '🟠',
      false: '✖️',
    }[String(guess.result)];
  });
  const correctTotalHearts: number = totalHearts + (isWeekend ? 1 : 0);

  return generateShareableResult({
    heartsSpacing: ' ',
    additionalLines: [cleanUpAttempts.join(' ')],
    totalHearts: correctTotalHearts,
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyTeoriaDeConjuntosEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({
  data,
  language,
}: {
  data: DailyTeoriaDeConjuntosEntry;
  language: Language;
}) {
  const state = getInitialState(data);
  return writeResult({
    type: 'teoria-de-conjuntos',
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    guesses: state.guesses,
    isWeekend: state.isWeekend,
  });
}
