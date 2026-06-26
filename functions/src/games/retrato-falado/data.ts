// Types
import type { MonsterImageData } from '../../types/tdr';
import type { MonsterSketch, ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { PLAYER_COUNTS } from './constants';
// Services
import { updateFirestoreCommunityDataRecursively } from '../../services/community-data';
import {
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
  fetchGlobalTrackerDocumentData,
} from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Utils
import { filterOutByIds } from '../../utils';

/**
 * Get monster cards ids
 * @returns Resource data containing available monster images
 */
export const getMonsterCards = async (): Promise<ResourceData> => {
  // Get images info
  const allMonsters = await fetchResource<Dictionary<MonsterImageData>>(TDR_RESOURCES.MONSTER_ORIENTATION);
  // Get used deck
  const usedCards = await fetchGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.MONSTERS, {});

  // Filter out used cards
  const availableMonsters = filterOutByIds(allMonsters, usedCards);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableMonsters).length < PLAYER_COUNTS.MAX) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.MONSTERS);
    return { allMonsters };
  }

  return {
    allMonsters: availableMonsters,
  };
};

/**
 * Save used cards to the global document
 * @param sketches - Array of monster sketches with player drawings
 * @param language - The language code for the saved data
 */
export const saveData = async (sketches: MonsterSketch[], language: Language): Promise<void> => {
  const usedIds: Dictionary<boolean> = {};
  const drawings = sketches.reduce((acc, entry) => {
    usedIds[entry.id] = true;
    const key = [entry.id, entry.playerId, Date.now()].join('::');
    acc[key] = {
      id: entry.id,
      playerId: entry.playerId,
      drawing: entry.sketch,
    };
    return acc;
  }, {});
  await updateFirestoreCommunityDataRecursively('monsterDrawings', language, drawings);

  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.MONSTERS, usedIds);
};
