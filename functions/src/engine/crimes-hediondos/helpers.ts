// Types
import { PlainObject, Players, Round } from '../../utils/types';
// Constants
import { CRIMES_HEDIONDOS_PHASES, ITEMS_GROUP_COUNT, ITEMS_PER_GROUP, SCENE_TILES_COUNT } from './constants';
import { CrimesHediondosCard, SceneTile } from './types';
// Utils
// import * as utils from '../../utils/helpers';
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, CRIME_SELECTION, SCENE_MARKING, GUESSING, REVEAL, GAME_OVER } =
    CRIMES_HEDIONDOS_PHASES;
  const order = [RULES, SETUP, CRIME_SELECTION, SCENE_MARKING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return triggerLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : SCENE_MARKING;
  }

  if (currentPhase === CRIME_SELECTION) {
    return GUESSING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return SCENE_MARKING;
};

type ParsedTiles = {
  causeOfDeathTile: SceneTile;
  reasonForEvidenceTile: SceneTile;
  locationTiles: SceneTile[];
  sceneTiles: SceneTile[];
};

export const parseTiles = (sceneTiles: SceneTile[]): ParsedTiles => {
  const result = sceneTiles.reduce(
    (acc: any, tile: SceneTile) => {
      if (tile.type === 'cause') {
        acc.causeOfDeathTile = tile;
      } else if (tile.type === 'evidence') {
        acc.reasonForEvidenceTile = tile;
      } else if (tile.type === 'location') {
        acc.locationTiles.push(tile);
      } else {
        acc.sceneTiles.push(tile);
      }

      return acc;
    },
    {
      causeOfDeathTile: {},
      reasonForEvidenceTile: {},
      locationTiles: [],
      sceneTiles: [],
    }
  );

  result.sceneTiles = gameUtils.getRandomItems(result.sceneTiles, SCENE_TILES_COUNT);

  return result;
};

type GroupItems = {
  items: {
    [key: string]: CrimesHediondosCard;
  };
  groupedItems: {
    [key: string]: string[];
  };
};

export const groupItems = (weapons: CrimesHediondosCard[], evidence: CrimesHediondosCard[]): GroupItems => {
  // Divide weapons into 4 groups
  const groupedWeapons = gameUtils.sliceIntoChunks(weapons, ITEMS_PER_GROUP);
  // Add evidence into each weapon group
  const groupedEvidence = gameUtils.sliceIntoChunks(evidence, ITEMS_PER_GROUP);
  const groupedItems = {};
  groupedEvidence.forEach((evidenceGroup, index) => {
    groupedItems[`${index}`] = [...groupedWeapons[index].map((i) => i.id), ...evidenceGroup.map((i) => i.id)];
  });

  const itemsDict = [...weapons, ...evidence].reduce((acc: PlainObject, item: CrimesHediondosCard) => {
    acc[item.id] = item;
    return acc;
  }, {});

  return {
    items: itemsDict,
    groupedItems,
  };
};

export const dealItemGroups = (players: Players) => {
  const gameOrder = gameUtils.shuffle(Object.keys(players));

  gameOrder.forEach((playerId, index) => {
    players[playerId].itemGroupIndex = index % ITEMS_GROUP_COUNT;
  });
};
