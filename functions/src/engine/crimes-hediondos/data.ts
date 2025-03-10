// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { CrimeSceneTile, CrimesHediondosCard } from '../../types/tdr';
import type { CrimesHediondosOptions, ResourceData } from './types';
// Helpers
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { CARDS_PER_GAME } from './constants';
/**
 * Get question resource based on the game's language
 * @returns
 */
export const getData = async (options: CrimesHediondosOptions): Promise<ResourceData> => {
  // Get weapon cards
  const allWeapons = await resourceUtils.fetchResource<Dictionary<CrimesHediondosCard>>(
    TDR_RESOURCES.CRIME_WEAPONS,
  );

  // Get evidence cards
  const allEvidence = await resourceUtils.fetchResource<Dictionary<CrimesHediondosCard>>(
    TDR_RESOURCES.CRIME_EVIDENCE,
  );

  // Get scene tiles
  const allScenes = await resourceUtils.fetchResource<Dictionary<CrimeSceneTile>>(TDR_RESOURCES.CRIME_SCENES);

  // Filter weapons and evidence
  const useOriginalImages = options.originalImages ?? false;

  const listOfWeapons = Object.values(allWeapons)
    .filter((weapon) => {
      return useOriginalImages ? !weapon.itemExclusive : !!weapon.itemId;
    })
    .map((weapon) => {
      // biome-ignore lint/performance/noDelete: firebase does not accept undefined values
      delete weapon.itemExclusive;

      if (useOriginalImages) {
        // biome-ignore lint/performance/noDelete: firebase does not accept undefined values
        delete weapon.itemId;
      }
      return weapon;
    });

  const listOfEvidence = Object.values(allEvidence)
    .filter((evidence) => {
      return useOriginalImages ? !evidence.itemExclusive : !!evidence.itemId;
    })
    .map((evidence) => {
      // biome-ignore lint/performance/noDelete: firebase does not accept undefined values
      delete evidence.itemExclusive;

      if (useOriginalImages) {
        // biome-ignore lint/performance/noDelete: firebase does not accept undefined values
        delete evidence.itemId;
      }
      return evidence;
    });

  return {
    weapons: utils.game.getRandomItems(listOfWeapons, CARDS_PER_GAME),
    evidence: utils.game.getRandomItems(listOfEvidence, CARDS_PER_GAME),
    allScenes: Object.values(allScenes),
  };
};
