// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { FileiraDeFatosOptions, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import type { TextCard } from '../../types/tdr';

/**
 * Get scenarios resource based on the game's language
 * @param language
 * @returns
 */
export const getScenarios = async (
  language: string,
  options: FileiraDeFatosOptions,
): Promise<ResourceData> => {
  // Get full deck
  const allScenarios = await resourceUtils.fetchResource<Dictionary<TextCard>>(
    TDR_RESOURCES.SCENARIOS,
    language,
  );

  return {
    scenarios: Object.values(allScenarios).filter((scenario) => (options.nsfw ? true : !scenario.nsfw)),
  };
};
