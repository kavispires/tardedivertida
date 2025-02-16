// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getLocations = async (language: string): Promise<ResourceData> => {
  // Get full deck
  const allLocations = await resourceUtils.fetchResource<Dictionary<Location>>(
    TDR_RESOURCES.SPY_LOCATIONS,
    language,
  );

  return {
    allLocations: Object.values(allLocations),
  };
};
