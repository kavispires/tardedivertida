import type { IdadeDaPredaOptions, ResourceData } from './types';
import utils from '../../utils';
import type { ItemData } from '../../types/tdr';
import { AGE_1_ITEMS_COUNT, ITEMS_PER_PLAYER_PER_AGE, NEW_AGES_COUNT, PLAYER_COUNTS } from './constants';
import { sampleSize } from 'lodash';

/**
 * Example data structure for game data
 * Update this based on your game requirements
 * @param options - Game options including NSFW setting
 * @returns Resource data containing items organized by age (0-5)
 */
export const getResourceData = async (options: IdadeDaPredaOptions): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;

  // Get items per player
  const allItems = await utils.tdr.getItems(undefined, {
    allowNSFW,
    decks: ['age1', 'age2', 'age3', 'age4', 'age5'],

    // cleanUp: utils.tdr.itemUtils.cleanupDecks,
  });

  const allAge1: ItemData[] = [];
  const allAge2: ItemData[] = [];
  const allAge3: ItemData[] = [];
  const allAge4: ItemData[] = [];
  const allAge5: ItemData[] = [];

  allItems.forEach((item) => {
    if (item.decks?.includes('age1')) {
      allAge1.push(cleanUpItem(item, 'age1'));
    }
    if (item.decks?.includes('age2')) {
      allAge2.push(cleanUpItem(item, 'age2'));
    }
    if (item.decks?.includes('age3')) {
      allAge3.push(cleanUpItem(item, 'age3'));
    }
    if (item.decks?.includes('age4')) {
      allAge4.push(cleanUpItem(item, 'age4'));
    }
    if (item.decks?.includes('age5')) {
      allAge5.push(cleanUpItem(item, 'age5'));
    }
  });

  // Get the table count for each area plus items per player as if there were 10 players
  const age1Quantity = AGE_1_ITEMS_COUNT + PLAYER_COUNTS.MAX * ITEMS_PER_PLAYER_PER_AGE;
  const otherAgesQuantity = NEW_AGES_COUNT + PLAYER_COUNTS.MAX * ITEMS_PER_PLAYER_PER_AGE;
  const selectedAge1 = sampleSize(allAge1, age1Quantity);

  return {
    0: selectedAge1.slice(0, AGE_1_ITEMS_COUNT),
    1: selectedAge1.slice(AGE_1_ITEMS_COUNT),
    2: sampleSize(allAge2, otherAgesQuantity),
    3: sampleSize(allAge3, otherAgesQuantity),
    4: sampleSize(allAge4, otherAgesQuantity),
    5: sampleSize(allAge5, otherAgesQuantity),
  };
};

const cleanUpItem = (item: ItemData, age: string): ItemData => {
  return {
    id: item.id,
    name: item.name,
    decks: [age],
  };
};
