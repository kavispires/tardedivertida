// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import { CrimesHediondosCard } from '../../types/tdr';
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
  const allWeapons: Collection<CrimesHediondosCard> = await resourceUtils.fetchResource(
    TDR_RESOURCES.CRIME_WEAPONS
  );

  // Get evidence cards
  const allEvidence: Collection<CrimesHediondosCard> = await resourceUtils.fetchResource(
    TDR_RESOURCES.CRIME_EVIDENCE
  );

  // Get scene tiles
  const allScenes = await resourceUtils.fetchResource(TDR_RESOURCES.CRIME_TILES);

  // Filter weapons and evidence
  const useOriginalImages = options.originalImages ?? false;

  const listOfWeapons = Object.values(allWeapons)
    .filter((weapon) => {
      return useOriginalImages ? !weapon.itemExclusive : !!weapon.itemId;
    })
    .map((weapon) => {
      delete weapon.itemExclusive;

      if (useOriginalImages) {
        delete weapon.itemId;
      }
      return weapon;
    });

  const listOfEvidence = Object.values(allEvidence)
    .filter((evidence) => {
      return useOriginalImages ? !evidence.itemExclusive : !!evidence.itemId;
    })
    .map((evidence) => {
      delete evidence.itemExclusive;

      if (useOriginalImages) {
        delete evidence.itemId;
      }
      return evidence;
    });

  return {
    weapons: utils.game.getRandomItems(listOfWeapons, CARDS_PER_GAME),
    evidence: utils.game.getRandomItems(listOfEvidence, CARDS_PER_GAME),
    allScenes,
  };
};
