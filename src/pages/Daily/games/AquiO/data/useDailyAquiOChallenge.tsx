import { App } from 'antd';
import { orderBy, sample } from 'lodash';
import { print, removeDuplicates } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

import { getDayOfYear, wait } from '../../../utils';
import { AquiOSet, DailyAquiOEntry } from '../utils/types';
import miscSets from './misc-sets.json';
import sets from './sets.json';

const ALL_SETS: AquiOSet[] = sets;
const SETS = orderBy(
  ALL_SETS.filter((set) => removeDuplicates(set.itemsIds).filter(Boolean).length === 22),
  [(s) => s.itemsIds[1]]
);
const MISC_SETS: AquiOSet[] = miscSets;

export function useDailyAquiOChallenge(today: string, collectionName: string, isRandomGame: boolean) {
  const { notification } = App.useApp();
  const day = getDayOfYear();

  // Load challenge
  return useQuery<DailyAquiOEntry>({
    queryKey: [collectionName, 'ache-isso', isRandomGame ? 'random' : today],
    queryFn: async () => {
      console.count(`Creating Ache Isso ${collectionName}...`);
      // Build game getting the set based on today's date
      const todaysSet = SETS[(day - 1) % SETS.length] ?? SETS[0];
      await wait(150);
      // return buildGame(isRandomGame ? sample(MISC_SETS) ?? MISC_SETS[0] : todaysSet);
      const chosenSet = isRandomGame ? sample(MISC_SETS) ?? MISC_SETS[0] : todaysSet;
      return {
        id: today,
        type: 'aqui-o',
        title: chosenSet.title,
        itemsIds: chosenSet.itemsIds,
      };
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
