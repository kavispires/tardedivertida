import { sampleSize } from 'lodash';
// Types
import type { CrimeSceneTileData, CrimesHediondosCardData } from '../../types/tdr';
import type { CrimesHediondosOptions, ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { CARDS_PER_GAME } from './constants';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get question resource based on the game's language
 * @param options - Game options including location and victim settings
 * @returns Resource data containing weapons, evidence, scenes, locations, and victims
 */
export const getData = async (options: CrimesHediondosOptions): Promise<ResourceData> => {
  // Get weapon cards
  const allWeapons = await resourceUtils.fetchResource<Dictionary<CrimesHediondosCardData>>(
    TDR_RESOURCES.CRIME_WEAPONS,
  );

  // Get evidence cards
  const allEvidence = await resourceUtils.fetchResource<Dictionary<CrimesHediondosCardData>>(
    TDR_RESOURCES.CRIME_EVIDENCE,
  );

  // Get locations
  const locations: CrimesHediondosCardData[] = [];
  if (options.withLocations) {
    locations.push(
      ...sampleSize(
        Object.values(
          await resourceUtils.fetchResource<Dictionary<CrimesHediondosCardData>>(
            TDR_RESOURCES.CRIME_LOCATIONS,
          ),
        ),
        CARDS_PER_GAME,
      ),
    );
  }

  // Get victims
  const victims: CrimesHediondosCardData[] = [];
  if (options.withVictims) {
    victims.push(
      ...sampleSize(
        Object.values(
          await resourceUtils.fetchResource<Dictionary<CrimesHediondosCardData>>(TDR_RESOURCES.CRIME_VICTIMS),
        ),
        CARDS_PER_GAME,
      ),
    );
  }

  // Get scene tiles
  const allScenes = await resourceUtils.fetchResource<Dictionary<CrimeSceneTileData>>(
    TDR_RESOURCES.CRIME_SCENES,
  );

  // Filter weapons and evidence
  const listOfWeapons = Object.values(allWeapons).filter((weapon) => {
    return !!weapon.itemId;
  });

  const listOfEvidence = Object.values(allEvidence).filter((evidence) => {
    return !!evidence.itemId;
  });

  return {
    weapons: sampleSize(listOfWeapons, CARDS_PER_GAME),
    evidence: sampleSize(listOfEvidence, CARDS_PER_GAME),
    allScenes: Object.values(allScenes),
    locations,
    victims,
  };
};
