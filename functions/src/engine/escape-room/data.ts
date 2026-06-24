// Types
import type { EscapeRoomOptions, ResourceData } from './types';

// import * as dataUtils from '../collections';
// import utils from '../../utils';
// import * as resourceUtils from '../resource';
import { TDR_RESOURCES } from '../../utils/constants';
import { MISSIONS_COUNT } from './constants';

/**
 * Get game json and build it
 * @param language - The language code for localized resources
 * @param options - Game options including duration and NSFW setting
 * @returns Resource data containing episode configuration
 */
export const getEpisode = async (language: Language, options?: EscapeRoomOptions): Promise<ResourceData> => {
  const numberOfMissions = MISSIONS_COUNT[options?.duration ?? 'default'];
  const allowNSFW = !!options?.nsfw;

  // Something happens ???

  return {
    language,
    allowNSFW,
    numberOfMissions,
    resource: TDR_RESOURCES.ESCAPE_ROOM_EPISODES,
  };
};
