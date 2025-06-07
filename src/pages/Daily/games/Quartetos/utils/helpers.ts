import { cloneDeep, orderBy } from 'lodash';
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyQuartetosEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
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
    defaultValue: cloneDeep(DEFAULT_LOCAL_TODAY),
  });

  const useInitialGrid = localToday.grid.length === 0 && localToday.matches.length === 0;

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

export const buildSetKey = (s: string[]) => orderBy(s, (o) => Number(o)).join('-');

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  guesses,
  sets,
  ...rest
}: BasicResultsOptions & {
  guesses: string[];
  sets: DailyQuartetosEntry['sets'];
}): string {
  const EMOJIS = ['🟩', '🟨', '🟧', '🟪'];
  const EMOJIS_MAP = sets.reduce((acc: StringDictionary, set) => {
    set.itemsIds.forEach((itemId) => {
      acc[itemId] = EMOJIS[set.level];
    });
    return acc;
  }, {});

  const result = guesses.map((guess) => {
    const guessItems = guess.split('-');
    const guessResult = guessItems.map((itemId) => EMOJIS_MAP[itemId] || '❓').join(' ');
    return guessResult;
  });

  return generateShareableResult({
    heartsSpacing: ' ',
    additionalLines: result,
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyQuartetosEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({
  data,
  language,
}: {
  data: DailyQuartetosEntry;
  language: Language;
}) {
  const state = getInitialState(data);
  return writeResult({
    type: 'quartetos',
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    guesses: state.guesses,
    sets: data.sets,
  });
}
