// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';

/**
 * Get words resource based on the game's language
 * @param language
 * @returns
 */
export const getLocations = async (language: string): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.SPY_LOCATIONS}-${language}`;
  // Get full deck
  const allLocations = await resourceUtils.fetchResource(resourceName);

  return {
    allLocations: Object.values(allLocations),
  };
};
