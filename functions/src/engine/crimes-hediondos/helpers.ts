// Types
import { PlainObject, PlayerId, Players, RankingEntry, Round } from '../../utils/types';
// Constants
import { CRIMES_HEDIONDOS_PHASES, ITEMS_GROUP_COUNT, ITEMS_PER_GROUP, SCENE_TILES_COUNT } from './constants';
import { Crime, CrimesHediondosCard, SceneTile } from './types';
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
  Object.keys(players).forEach((playerId) => {
    players[playerId].itemGroupIndex = Math.round(Math.random() * 100) % ITEMS_GROUP_COUNT;
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

export const updateOrCreateGuessHistory = (crimes: Crime[], players: Players) => {
  Object.values(players).forEach((player) => {
    player.history = player.history ?? {};
    player.correctCrimes = 0;
    console.log('=======');
    console.log({ playerId: player.id });

    crimes.forEach((crime) => {
      if (crime.playerId !== player.id) {
        if (player.history[crime.playerId] === undefined) {
          player.history[crime.playerId] = [];
        }
        const guess = player.guesses[crime.playerId];

        console.log({ guess });
        const isWeaponCorrect = crime.weaponId === guess.weaponId;
        const isEvidenceCorrect = crime.evidenceId === guess.evidenceId;
        const isCorrect = isWeaponCorrect && isEvidenceCorrect;
        player.history[crime.playerId].push({
          weaponId: guess.weaponId,
          evidenceId: guess.evidenceId,
          correct: isCorrect,
        });
        // Scoring
        player.correctCrimes += isCorrect ? 1 : 0;
        player.secretScore += isWeaponCorrect ? 1 : 0;
        player.secretScore += isEvidenceCorrect ? 1 : 0;
        player.secretScore += isCorrect ? 3 : 0;
        // Crime author score
        players[crime.playerId].secretScore += isWeaponCorrect ? 1 : 0;
        players[crime.playerId].secretScore += isEvidenceCorrect ? 1 : 0;
        players[crime.playerId].secretScore += isCorrect ? 1 : 0;
      }
    });
  });
};

type BuiltRanking = {
  ranking: RankingEntry[];
  winners: PlayerId[];
};

export const buildRanking = (players: Players): BuiltRanking => {
  const winners: PlayerId[] = [];

  const playerCount = Object.keys(players).length;

  const ranking: RankingEntry[] = Object.values(players)
    .map((player) => {
      // Update player score
      const win = playerCount - 1 === player.correctCrimes;
      if (win) {
        winners.push(player.id);
      }

      const pastCorrectCrimes = player.correctCrimes ?? 0;
      const correctCrimes = player.correctCrimes ?? 0;

      return {
        playerId: player.id,
        name: player.name,
        previousScore: pastCorrectCrimes ?? 0,
        gainedPoints: [correctCrimes - pastCorrectCrimes],
        newScore: correctCrimes,
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  return {
    ranking,
    winners,
  };
};
