import { sample } from 'lodash';
import { print } from 'utils/helpers';

import { useQuery } from '@tanstack/react-query';

import { wait } from '../../../utils';
import { AquiOSet, DailyAquiOEntry } from '../utils/types';
import miscSets from './misc-sets.json';

const MISC_SETS: AquiOSet[] = miscSets;

export function useRandomAquiOChallenge(collectionName: string) {
  // Load challenge
  return useQuery<DailyAquiOEntry>({
    queryKey: [collectionName, 'aqui-o', 'random'],
    queryFn: async () => {
      console.count(`Creating Ache Isso ${collectionName}...`);
      // Build game getting the set based on today's date
      await wait(150);

      const chosenSet = sample(MISC_SETS)!;

      const gameData: DailyAquiOEntry = {
        id: 'random',
        type: 'aqui-o',
        setId: chosenSet.title.en,
        title: chosenSet.title,
        itemsIds: chosenSet.itemsIds,
        number: 0,
      };

      print({ [collectionName]: gameData }, 'table');
      return gameData;
    },
    retry: false,
  });
}
