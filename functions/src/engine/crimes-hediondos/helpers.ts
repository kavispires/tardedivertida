// Types
import { PlainObject, Players, RankingEntry, Round } from '../../utils/types';
// Constants
import { CRIMES_HEDIONDOS_PHASES, ITEMS_GROUP_COUNT, ITEMS_PER_GROUP, SCENE_TILES_COUNT } from './constants';
import { Crime, CrimesHediondosCard, SceneTile } from './types';
// Utils
// import * as utils from '../../utils/helpers';
import * as gameUtils from '../../utils/game-utils';
import { buildNewScoreObject } from '../../utils/helpers';

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

export const buildCrimes = (
  players: Players,
  causeOfDeathTile: SceneTile,
  reasonForEvidenceTile: SceneTile
): Crime[] => {
  return Object.values(players).map((player) => {
    return {
      playerId: player.id,
      weaponId: player.weaponId,
      evidenceId: player.evidenceId,
      scenes: {
        [causeOfDeathTile.id]: player.causeOfDeath,
        [reasonForEvidenceTile.id]: player.reasonForEvidence,
        [player.locationTile]: player.locationIndex,
      },
    };
  });
};

type BuiltScenes = {
  scenes: {
    [key: string]: SceneTile;
  };
  order: string[];
};

export const buildScenes = (
  causeOfDeathTile: SceneTile,
  reasonForEvidenceTile: SceneTile,
  locationTiles: SceneTile[],
  players: Players
): BuiltScenes => {
  const locationsUsedByPlayers = Object.values(players).map((player) => player.locationTile);
  const locations = locationTiles.filter((locationTile) => locationsUsedByPlayers.includes(locationTile.id));

  const order = [causeOfDeathTile.id, reasonForEvidenceTile.id, ...locations.map((location) => location.id)];

  const scenes = {
    [causeOfDeathTile.id]: causeOfDeathTile,
    [reasonForEvidenceTile.id]: reasonForEvidenceTile,
  };

  locations.forEach((location) => (scenes[location.id] = location));

  return { scenes, order };
};

export const updateCrime = (crimes: Crime[], players: Players, currentScene: SceneTile): Crime[] => {
  return crimes.map((crime) => {
    crime.scenes[currentScene.id] = players[crime.playerId].sceneIndex;
    return crime;
  });
};

type Counts = {
  [key: string]: {
    bothCorrect: number;
    correctItems: number;
    win: boolean;
  };
};

type BuiltRanking = {
  ranking: RankingEntry[];
  counts: Counts;
};

export const buildRanking = (players: Players): BuiltRanking => {
  const newScores = buildNewScoreObject(players, [0, 0]);

  const counts: Counts = {};

  Object.keys(players).forEach((playerId) => {
    counts[playerId] = {
      bothCorrect: 0,
      correctItems: 0,
      win: false,
    };
  });

  Object.values(players).forEach((player) => {
    Object.entries(player.guesses).forEach(([playerId, guessObj]: [any, any]) => {
      const gotWeaponCorrect = players[playerId].weaponId === guessObj.weapon;
      const gotEvidenceCorrect = players[playerId].evidenceId === guessObj.evidence;
      const gotBothCorrect = gotWeaponCorrect && gotEvidenceCorrect;

      // Getting correct points
      if (gotWeaponCorrect) {
        newScores[player.id].gainedPoints[0] += 1;
        newScores[player.id].newScore += 1;

        newScores[playerId].gainedPoints[1] += 1;
        newScores[playerId].newScore += 1;

        counts[player.id].correctItems += 1;
      }

      if (gotEvidenceCorrect) {
        newScores[player.id].gainedPoints[0] += 1;
        newScores[player.id].newScore += 1;

        newScores[playerId].gainedPoints[1] += 1;
        newScores[playerId].newScore += 1;

        counts[player.id].correctItems += 1;
      }

      if (gotBothCorrect) {
        newScores[player.id].gainedPoints[0] += 1;
        newScores[player.id].newScore += 1;

        counts[player.id].bothCorrect += 1;
      }
    });
  });

  const playerCount = Object.keys(players).length;
  // Verify if anybody won
  Object.keys(counts).forEach((playerId) => {
    counts[playerId].win = counts[playerId].bothCorrect === playerCount - 1;
  });

  const ranking: RankingEntry[] = Object.entries(newScores)
    .map(([playerId, scores]) => {
      // Update player score
      players[playerId].score = scores.newScore;

      return {
        playerId,
        name: players[playerId].name,
        previousScore: scores.previousScore,
        gainedPoints: scores.gainedPoints,
        newScore: scores.newScore,
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  return {
    ranking,
    counts,
  };
};
