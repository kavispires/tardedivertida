import fetch from 'cross-fetch';
// Helpers
import { throwHttpsError } from '../services/firebase-core';

/**
 * Queries a TDR resource file
 * @param resourceName - The name of the resource to fetch
 * @param language - Optional language code for localized resources
 */
export const fetchResource = async <T>(resourceName: string, language?: Language | string): Promise<T> => {
  try {
    const response = await fetch(
      `${process.env.TD_RESOURCES}${resourceName}${language ? `-${language}` : ''}.json`,
    );
    return response.json();
  } catch (e) {
    return throwHttpsError(`${e}`, `Failed to get resource for ${resourceName}`);
  }
};
