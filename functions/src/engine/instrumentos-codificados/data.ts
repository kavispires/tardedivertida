// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import * as resourceUtils from '../resource';

/**
 * Get theme cards resource based on the game's language
 * @param language
 * @returns
 */
export const getThemes = async (language: string) => {
  const resourceName = `${TDR_RESOURCES.THEMES}-${language}`;
  return await resourceUtils.fetchResource(resourceName);
};
