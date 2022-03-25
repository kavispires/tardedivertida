import fetch from 'cross-fetch';
// Helpers
import * as utils from '../utils';

/**
 * Queries a tdr file
 * @param resourceName
 * @returns
 */
export const fetchResource = async (resourceName: string): Promise<any> => {
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
export const fetchTDIData = async (dataFileName: string): Promise<any> => {
  try {
    const response = await fetch(`${utils.firebase.config().td_url.data}${dataFileName}.json`);
    return response.json();
  } catch (e) {
    return utils.firebase.throwException(`${e}`, `Failed to get image data for ${dataFileName}`);
  }
};
