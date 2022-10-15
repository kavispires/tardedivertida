import fetch from 'cross-fetch';
// Helpers
import utils from '../utils';

/**
 * Queries a tdr file
 * @param resourceName
 * @returns
 */
export const fetchResource = async <T>(resourceName: string): Promise<T | any> => {
  try {
    const response = await fetch(`${utils.firebase.config().td_url.resources}${resourceName}.json`);
    return response.json();
  } catch (e) {
    return utils.firebase.throwException(`${e}`, `Failed to get resource for ${resourceName}`);
  }
};

/**
 * Queries a tdi data file
 * @param path
 * @returns
 */
export const fetchTDIData = async <T>(dataFileName: string): Promise<T | any> => {
  try {
    const response = await fetch(`${utils.firebase.config().td_url.data}${dataFileName}.json`);
    return response.json();
  } catch (e) {
    return utils.firebase.throwException(`${e}`, `Failed to get image data for ${dataFileName}`);
  }
};
