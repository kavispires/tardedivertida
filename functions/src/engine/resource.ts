import fetch from 'cross-fetch';
import * as firebaseUtils from '../utils/firebase';

export const fetchResource = async (resourceName: string): Promise<any> => {
  console.log({ env: process.env.TDI_RESOURCE_URL });
  console.log(process.env);

  try {
    const response = await fetch(`https://www.kavispires.com/tdi/resources/${resourceName}.json`);
    return response.json();
  } catch (e) {
    return firebaseUtils.throwException(`${e}`, `Failed to get resource for ${resourceName}`);
  }
};
