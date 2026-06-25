// Types
import type { DilemmaCardData } from '../../types/tdr';
import type { EsquiadoresOptions, ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
// Services
import { fetchResource } from '../../services/resource';

/**
 * Get dilemmas resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing dilemma cards
 */
export const getDilemmas = async (language: string, options: EsquiadoresOptions): Promise<ResourceData> => {
  // Get full deck
  const allDilemmas = await fetchResource<Dictionary<DilemmaCardData>>(TDR_RESOURCES.DILEMMAS, language);

  return {
    dilemmas: Object.values(allDilemmas).filter((scenario) => (options.nsfw ? true : !scenario.nsfw)),
  };
};
