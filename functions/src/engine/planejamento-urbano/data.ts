// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import type { CityLocation } from '../../types/tdr';

/**
 * Get city locations resource based on the game's language
 * @param language
 * @returns
 */
export const getLocations = async (): Promise<ResourceData> => {
  // Get full deck
  const allCityLocations = await resourceUtils.fetchResource<Dictionary<CityLocation>>(
    TDR_RESOURCES.CITY_LOCATIONS,
  );

  return { allCityLocations };
};
