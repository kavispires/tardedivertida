// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import type { CityLocationData } from '../../types/tdr';

/**
 * Get city locations resource based on the game's language
 * @returns Resource data containing all city location cards
 */
export const getLocations = async (): Promise<ResourceData> => {
  // Get full deck
  const allCityLocations = await resourceUtils.fetchResource<Dictionary<CityLocationData>>(
    TDR_RESOURCES.CITY_LOCATIONS,
  );

  return { allCityLocations };
};
