import { chain, cloneDeep, merge, orderBy, random, sample, sampleSize, shuffle } from 'lodash';
import moment from 'moment';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Utils
import { SEPARATOR } from 'utils/constants';
// Internal
import type { AquiODisc, DailyAquiOEntry, GameState } from './types';
import { SETTINGS } from './settings';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  maxProgress: 0,
  hearts: SETTINGS.HEARTS,
  hardMode: false,
  attempts: 0,
  goal: SETTINGS.GOAL,
  discs: [],
};

/**
 * Retrieves the initial state for the game.
 * @param data - The DailyAquiOEntry data.
 * @param isRandomGame - A boolean indicating if the game is random.
 * @returns The initial game state.
 */
export const getInitialState = (data: DailyAquiOEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      hardMode: localStorage.getItem(SETTINGS.TD_DAILY_AQUI_O_MODE) === 'challenge',
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    maxProgress: localToday.maxProgress,
    goal: localToday.goal,
    discs: localToday.discs,
    hardMode: localToday.hardMode,
    attempts: localToday.attempts,
  };

  return state;
};

export const getDiscs = (
  entry: DailyAquiOEntry,
  challengingGame?: boolean,
  weekendGame?: boolean,
): AquiODisc[] => {
  const allItems = shuffle(entry.itemsIds);

  const discs: AquiODisc[] = [];

  for (let i = 0; i < 17; i++) {
    const previousCard = discs[i - 1];

    const card = createCards(
      allItems,
      previousCard,
      challengingGame ? discs[i - 1]?.match : undefined,
      weekendGame,
    );
    discs.push(card);
  }

  return discs;
};

const POSITIONS = Array(9)
  .fill(0)
  .map((_, i) => i);
const SIZES = [100, 90, 110, 80, 105, 130, 120, 150, 115];

const Z_INDEXES: NumberDictionary = {
  85: 8,
  80: 7,
  90: 6,
  100: 5,
  105: 4,
  110: 3,
  120: 2,
  130: 1,
  150: 0,
};

function createCards(
  list: string[],
  previousCard?: AquiODisc,
  previousMatchId?: string,
  nineSpots?: boolean,
): AquiODisc {
  const shuffledList = shuffle(list);
  const randomPositions = shuffle(POSITIONS);
  const randomSizes = shuffle(SIZES);

  if (!previousCard) {
    const items = sampleSize(shuffledList, nineSpots ? 9 : 8).map((itemId, i) => ({
      itemId,
      position: randomPositions[i],
      size: randomSizes[i],
      rotation: random(0, 360),
      zIndex: Z_INDEXES[randomSizes[i]],
    }));

    return {
      id: orderBy(items.map((item) => Number(item.itemId))).join(SEPARATOR),
      items,
    };
  }

  const previousCardItems = previousCard.items.map((item) => item.itemId);

  const newCardItems = chain(shuffledList)
    .difference(previousCardItems)
    .take(nineSpots ? 8 : 7)
    .value();
  const matchingItem =
    sample(previousCardItems.filter((item) => item !== previousMatchId)) ?? previousCardItems[0];

  const items = shuffle([...newCardItems, matchingItem]).map((itemId, i) => ({
    itemId,
    position: randomPositions[i],
    size: randomSizes[i],
    rotation: random(0, 360),
    zIndex: Z_INDEXES[randomSizes[i]],
  }));

  return {
    id: orderBy(items.map((item) => Number(item.itemId))).join(SEPARATOR),
    items,
    match: matchingItem,
  };
}

export function checkWeekend(dateString: string): boolean {
  const date = moment(dateString, 'YYYY-MM-DD');
  return [6, 0].includes(date.day()); // 0 represents Sunday and 6 represents Saturday in moment.js
}
