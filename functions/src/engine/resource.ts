import fetch from 'cross-fetch';
// Helpers
import * as firebaseUtils from '../utils/firebase';

export const fetchResource = async (resourceName: string): Promise<any> => {
  try {
    const response = await fetch(`${firebaseUtils.config().td_url.resources}${resourceName}.json`);
    return response.json();
  } catch (e) {
    return firebaseUtils.throwException(`${e}`, `Failed to get resource for ${resourceName}`);
  }
};
