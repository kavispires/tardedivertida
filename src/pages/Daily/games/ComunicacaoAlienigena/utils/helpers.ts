import { cloneDeep } from 'lodash';
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
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

/**
 * Generates a shareable result for the game with the given options.
 * @param options - The options for generating the result.
 */
export function writeResult({
  guesses,
  solution,
  ...rest
}: BasicResultsOptions & {
  guesses: string[];
  solution: string;
}) {
  const solutionItems = solution.split('-');

  const indexEmojis = ['🟤', '🟡', '🔵', '🟣'];

  const result = guesses.map((guess) => {
    const guessItems = guess.split('-');
    return guessItems
      .map((item, i) => {
        // Correct?
        if (item === solutionItems[i]) {
          return indexEmojis[i];
        }
        // Incorrect?
        if (solutionItems.includes(item)) {
          return '❌';
        }
        // Missing?
        return '👽';
      })
      .join('');
  });

  return generateShareableResult({
    additionalLines: result,
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyComunicacaoAlienigenaEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({
  data,
  language,
}: {
  data: DailyComunicacaoAlienigenaEntry;
  language: Language;
}) {
  const state = getInitialState(data);
  return writeResult({
    type: 'comunicacao-alienigena',
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    solution: data.solution,
    guesses: state.guesses,
  });
}
