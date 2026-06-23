// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { EsquiadoresOptions, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import type { DilemmaCardData } from '../../types/tdr';

/**
 * Get dilemmas resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW setting
 * @returns Resource data containing dilemma cards
 */
export const getDilemmas = async (language: string, options: EsquiadoresOptions): Promise<ResourceData> => {
  // Get full deck
  const allDilemmas = await resourceUtils.fetchResource<Dictionary<DilemmaCardData>>(
    TDR_RESOURCES.DILEMMAS,
    language,
  );

  return {
    dilemmas: Object.values(allDilemmas).filter((scenario) => (options.nsfw ? true : !scenario.nsfw)),
  };
};
