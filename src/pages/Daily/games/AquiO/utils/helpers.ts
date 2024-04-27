import { chain, random, sample, sampleSize, shuffle } from 'lodash';
import { SEPARATOR } from 'utils/constants';

import { AquiODisc, DailyAquiOEntry } from './types';

export const getDiscs = (entry: DailyAquiOEntry, hardGame?: boolean): AquiODisc[] => {
  const allItems = shuffle(entry.itemsIds);

  const discs: AquiODisc[] = [];

  for (let i = 0; i < 16; i++) {
    const previousCard = discs[i - 1];
    const card = createCards(allItems, previousCard);
    discs.push(card);
  }

  return discs;
};

const POSITIONS = Array(9)
  .fill(0)
  .map((_, i) => i);
const SIZES = [100, 90, 110, 80, 100, 130, 120, 150];

function createCards(list: string[], previousCard?: AquiODisc): AquiODisc {
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
