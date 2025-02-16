// Constants
import type { ThingPromptCard } from '../../types/tdr';
import { TDR_RESOURCES } from '../../utils/constants';
// Helpers
import * as resourceUtils from '../resource';

/**
 * Get theme cards resource based on the game's language
 * @param language
 * @returns
 */
export const getThemes = async (language: string) => {
  return await resourceUtils.fetchResource<Dictionary<ThingPromptCard>>(
    TDR_RESOURCES.THING_PROMPTS,
    language,
  );
};
