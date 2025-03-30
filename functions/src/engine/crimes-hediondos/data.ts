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

  // Get locations
  const locations: CrimesHediondosCard[] = [];
  if (options.withLocations) {
    locations.push(
      ...utils.game.getRandomItems(
        Object.values(
          await resourceUtils.fetchResource<Dictionary<CrimesHediondosCard>>(TDR_RESOURCES.CRIME_LOCATIONS),
        ),
        CARDS_PER_GAME,
      ),
    );
  }

  // Get victims
  const victims: CrimesHediondosCard[] = [];
  if (options.withVictims) {
    victims.push(
      ...utils.game.getRandomItems(
        Object.values(
          await resourceUtils.fetchResource<Dictionary<CrimesHediondosCard>>(TDR_RESOURCES.CRIME_VICTIMS),
        ),
        CARDS_PER_GAME,
      ),
    );
  }

  // Get scene tiles
  const allScenes = await resourceUtils.fetchResource<Dictionary<CrimeSceneTile>>(TDR_RESOURCES.CRIME_SCENES);

  // Filter weapons and evidence
  const listOfWeapons = Object.values(allWeapons).filter((weapon) => {
    return !!weapon.itemId;
  });

  const listOfEvidence = Object.values(allEvidence).filter((evidence) => {
    return !!evidence.itemId;
  });

  return {
    weapons: utils.game.getRandomItems(listOfWeapons, CARDS_PER_GAME),
    evidence: utils.game.getRandomItems(listOfEvidence, CARDS_PER_GAME),
    allScenes: Object.values(allScenes),
    locations,
    victims,
  };
};
