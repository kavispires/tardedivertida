// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';

/**
 * Get scenarios resource based on the game's language
 * @param language
 * @returns
 */
export const getScenarios = async (language: string): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.SCENARIOS}-${language}`;
  // Get full deck
  const allScenarios: Collection<TextCard> = await resourceUtils.fetchResource(resourceName);

  return { scenarios: Object.values(allScenarios) };
};
