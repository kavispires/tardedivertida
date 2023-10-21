// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Helpers
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @returns
 */
export const getData = async (): Promise<ResourceData> => {
  // Get weapon cards
  const allWeapons: Collection<CrimesHediondosCard> = await resourceUtils.fetchTDIData('dmhk/wp');

  // Get evidence cards
  const allEvidence: Collection<CrimesHediondosCard> = await resourceUtils.fetchTDIData('dmhk/ev');

  // Get scene tiles
  const allScenes = await resourceUtils.fetchResource(TDR_RESOURCES.CRIME_TILES);

  return {
    allWeapons: Object.values(allWeapons),
    allEvidence: Object.values(allEvidence),
    allScenes,
  };
};
