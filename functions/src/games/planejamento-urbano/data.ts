// Types
import type { CityLocationData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
// Services
import { fetchResource } from '../../services/resource';

/**
 * Get city locations resource based on the game's language
 * @returns Resource data containing all city location cards
 */
export const getLocations = async (): Promise<ResourceData> => {
  // Get full deck
  const allCityLocations = await fetchResource<Dictionary<CityLocationData>>(TDR_RESOURCES.CITY_LOCATIONS);

  return { allCityLocations };
};
