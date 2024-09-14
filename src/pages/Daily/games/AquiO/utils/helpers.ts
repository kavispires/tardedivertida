import { chain, orderBy, random, sample, sampleSize, shuffle } from 'lodash';
import { SEPARATOR } from 'utils/constants';

import { AquiODisc, AquiOLocalToday, DailyAquiOEntry, GameState } from './types';
import { SETTINGS } from './settings';
import { loadLocalToday } from 'pages/Daily/utils';
import { deepCopy } from 'utils/helpers';

export const DEFAULT_LOCAL_TODAY: AquiOLocalToday = {
  id: '',
  number: 0,
  maxProgress: 0,
  hardMode: false,
  attempts: 0,
  hearts: SETTINGS.HEARTS,
};

/**
 * Retrieves the initial state for the game.
 * @param data - The DailyAquiOEntry data.
 * @param isRandomGame - A boolean indicating if the game is random.
 * @returns The initial game state.
 */
export const getInitialState = (data: DailyAquiOEntry, isRandomGame: boolean): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    hearts: SETTINGS.HEARTS,
    goal: SETTINGS.GOAL,
    discs: [],
    discIndex: 0,
    attempts: 0,
    maxProgress: 0,
  };

  if (!isRandomGame) {
    state.attempts = localToday.attempts ?? 0;
    state.discIndex = localToday.maxProgress ?? 0;
    state.maxProgress = localToday.maxProgress ?? 0;
    state.hearts = localToday.hearts ?? SETTINGS.HEARTS;
  }

  return state;
};

export const getDiscs = (entry: DailyAquiOEntry, challengingGame?: boolean): AquiODisc[] => {
  const allItems = shuffle(entry.itemsIds);

  const discs: AquiODisc[] = [];

  for (let i = 0; i < 17; i++) {
    const previousCard = discs[i - 1];

    const card = createCards(allItems, previousCard, challengingGame ? discs[i - 1]?.match : undefined);
    discs.push(card);
  }

  return discs;
};

const POSITIONS = Array(9)
  .fill(0)
  .map((_, i) => i);
const SIZES = [100, 90, 110, 80, 105, 130, 120, 150];

const Z_INDEXES: NumberDictionary = {
  80: 7,
  90: 6,
  100: 5,
  105: 4,
  110: 3,
  120: 2,
  130: 1,
  150: 0,
};

function createCards(list: string[], previousCard?: AquiODisc, previousMatchId?: string): AquiODisc {
  const shuffledList = shuffle(list);
  const randomPositions = shuffle(POSITIONS);
  const randomSizes = shuffle(SIZES);

  if (!previousCard) {
    const items = sampleSize(shuffledList, 8).map((itemId, i) => ({
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

  const newCardItems = chain(shuffledList).difference(previousCardItems).take(7).value();
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
