import { cloneDeep } from 'lodash';
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Utils
import { makeArray } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import type { DailyPortaisMagicosEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  currentCorridorIndex: 0,
  guesses: [[], [], []],
  currentCorridorIndexes: [],
  moves: 0,
};

export const getInitialState = (data: DailyPortaisMagicosEntry): GameState => {
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
    currentCorridorIndex: localToday.currentCorridorIndex,
    guesses: localToday.guesses,
    moves: localToday.moves,
    currentCorridorIndexes:
      localToday.currentCorridorIndexes.length > 0
        ? localToday.currentCorridorIndexes
        : makeArray(data.corridors[localToday.currentCorridorIndex].passcode.length).fill(1),
  };

  return state;
};

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  guesses,
  win,
  moves,
  ...rest
}: BasicResultsOptions & {
  guesses: string[][];
  win: boolean;
  moves: number;
}): string {
  const lastPlayedIndex = guesses.filter((guess) => guess.length > 0).length - 1;

  const result = guesses
    ?.map((guessBatch, index) => {
      const isLastGuessingRound = lastPlayedIndex === index;

      const quantity = Math.max(guessBatch?.length ?? 0, 0);

      const lostLives = Math.max(quantity - (isLastGuessingRound ? (win ? 1 : 0) : 1), 0);
      // Lost lives
      const lostHearts = Array(lostLives)
        .fill(0)
        .map(() => '💥')
        .join('');

      const correct = quantity - lostLives > 0 ? '🔶' : '';

      return [lostHearts, correct].join('');
    })
    .join('');

  return generateShareableResult({
    heartsSuffix: `(${moves} movimentos)`,
    additionalLines: [result],
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyPortaisMagicosEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({
  data,
  language,
}: {
  data: DailyPortaisMagicosEntry;
  language: Language;
}) {
  const state = getInitialState(data);
  return writeResult({
    type: 'portais-magicos',
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    guesses: state.guesses,
    win: state.status === STATUSES.WIN,
    moves: state.moves,
  });
}
