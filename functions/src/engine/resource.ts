import fetch from 'cross-fetch';
// Helpers
import utils from '../utils';

/**
 * Queries a tdr file
 * @param resourceName
 * @returns
 */
export const fetchResource = async <T = any>(resourceName: string): Promise<T | any> => {
  try {
    const response = await fetch(`${process.env.TD_RESOURCES}${resourceName}.json`);
    return response.json();
  } catch (e) {
    return utils.firebase.throwException(`${e}`, `Failed to get resource for ${resourceName}`);
  }
};
