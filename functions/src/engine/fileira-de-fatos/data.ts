// Types
import type { TextCardData } from '../../types/tdr';
import type { FileiraDeFatosOptions, ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get scenarios resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing scenario text cards
 */
export const getScenarios = async (
  language: string,
  options: FileiraDeFatosOptions,
): Promise<ResourceData> => {
  // Get full deck
  const allScenarios = await resourceUtils.fetchResource<Dictionary<TextCardData>>(
    TDR_RESOURCES.SCENARIOS,
    language,
  );

  return {
    scenarios: Object.values(allScenarios).filter((scenario) => (options.nsfw ? true : !scenario.nsfw)),
  };
};
