// Types
import type { ThingPromptCardData } from '../../types/tdr';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get theme cards resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Dictionary of thing prompt cards
 */
export const getThemes = async (language: string) => {
  return await resourceUtils.fetchResource<Dictionary<ThingPromptCardData>>(
    TDR_RESOURCES.THING_PROMPTS,
    language,
  );
};
