import { useQuery } from '@tanstack/react-query';
import { sample } from 'lodash';
// Utils
import { print } from 'utils/helpers';
// Internal
import type { AquiOSet, DailyAquiOEntry } from '../utils/types';
import { wait } from '../../../utils';
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

      const chosenSet = sample(MISC_SETS);

      if (!chosenSet) {
        throw new Error('No set found');
      }

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
