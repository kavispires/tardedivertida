import { App } from 'antd';
import { chain, orderBy, random, sample, sampleSize, shuffle } from 'lodash';
import { SEPARATOR } from 'utils/constants';
import { print, removeDuplicates } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

import miscSets from '../components/AquiO/misc-sets.json';
import sets from '../components/AquiO/sets.json';
import { getDayOfYear, wait } from '../utils';
import { AcheIssoDisc, AcheIssoSet, DailyAcheIssoEntry } from '../utils/types';

const ALL_SETS: AcheIssoSet[] = sets;
const SETS = orderBy(
  ALL_SETS.filter((set) => removeDuplicates(set.itemsIds).filter(Boolean).length === 22),
  [(s) => s.itemsIds[1]]
);
const MISC_SETS: AcheIssoSet[] = miscSets;

export function useDailyAcheIssoChallenge(today: string, collectionName: string, isRandomGame: boolean) {
  const { notification } = App.useApp();

  // Load challenge
  return useQuery<DailyAcheIssoEntry>({
    queryKey: [collectionName, 'ache-isso'],
    queryFn: async () => {
      console.count(`Creating Ache Isso ${collectionName}...`);
      // Build game getting the set based on today's date
      const day = getDayOfYear(today);
      const todaysSet = SETS[(day - 1) % SETS.length] ?? SETS[0];
      await wait(150);
      return buildGame(isRandomGame ? sample(MISC_SETS) ?? MISC_SETS[0] : todaysSet);
    },
    retry: false,
    onSuccess: (response) => {
      const data = response;
      print({ [collectionName]: data }, 'table');
    },
    onError: (e: any) => {
      notification.error({
        message: 'Failed to load user',
        description: JSON.stringify(e.message),
      });
    },
  });
}

const buildGame = (set: AcheIssoSet) => {
  const allItems = shuffle(set.itemsIds);

  const cards: AcheIssoDisc[] = [];

  for (let i = 0; i < 20; i++) {
    const previousCard = cards[i - 1];
    const card = createCards(allItems, previousCard);
    cards.push(card);
  }

  return {
    itemIds: allItems,
    cards,
    title: set.title,
  };
};

const POSITIONS = Array(9)
  .fill(0)
  .map((_, i) => i);
const SIZES = [100, 90, 110, 80, 100, 130, 120, 150];

function createCards(list: string[], previousCard?: AcheIssoDisc): AcheIssoDisc {
  const shuffledList = shuffle(list);
  const randomPositions = shuffle(POSITIONS);
  const randomSizes = shuffle(SIZES);

  if (!previousCard) {
    const items = sampleSize(shuffledList, 8).map((itemId, i) => ({
      itemId,
      position: randomPositions[i],
      size: randomSizes[i],
      rotation: random(0, 360),
    }));

    return {
      id: items.map((item) => item.itemId).join(SEPARATOR),
      items,
    };
  }

  const previousCardItems = previousCard.items.map((item) => item.itemId);

  const newCardItems = chain(shuffledList).difference(previousCardItems).take(7).value();
  const resultItem = sample(previousCardItems) ?? previousCardItems[0];
  const items = shuffle([...newCardItems, resultItem]).map((itemId, i) => ({
    itemId,
    position: randomPositions[i],
    size: randomSizes[i],
    rotation: random(0, 360),
  }));

  return {
    id: items.map((item) => item.itemId).join(SEPARATOR),
    items,
  };
}
