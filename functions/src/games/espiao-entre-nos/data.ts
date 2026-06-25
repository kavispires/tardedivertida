// Types
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Services
import { fetchResource } from '../../services/resource';

/**
 * Get words resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing spy location cards
 */
export const getLocations = async (language: string): Promise<ResourceData> => {
  // Get full deck
  const allLocations = await fetchResource<Dictionary<Location>>(TDR_RESOURCES.SPY_LOCATIONS, language);

  return {
    allLocations: Object.values(allLocations),
  };
};
