// Helpers
import * as resourceUtils from '../resource';
import { ResourceData } from './types';

/**
 * Get question resource based on the game's language
 * @returns
 */
export const getData = async (): Promise<ResourceData> => {
  // Get weapon cards
  const allWeapons = await resourceUtils.fetchTDIData('dmhk/wp');

  // Get evidence cards
  const allEvidence = await resourceUtils.fetchTDIData('dmhk/ev');

  // Get scene tiles
  const allScenes = await resourceUtils.fetchResource('crimes-hediondos-tiles');

  return {
    allWeapons: Object.values(allWeapons),
    allEvidence: Object.values(allEvidence),
    allScenes,
  };
};
