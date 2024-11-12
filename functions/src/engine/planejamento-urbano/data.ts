// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import { CityLocation } from '../../types/tdr';

/**
 * Get city locations resource based on the game's language
 * @param language
 * @returns
 */
export const getLocations = async (): Promise<ResourceData> => {
  // Get full deck
  const allCityLocations: Collection<CityLocation> = await resourceUtils.fetchResource(
    TDR_RESOURCES.CITY_LOCATIONS
  );

  return { allCityLocations };
};
