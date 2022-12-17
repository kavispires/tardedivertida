import stringSimilarity from 'string-similarity';
import utils from '../../utils';
import { MEGAMIX_PHASES, MINI_GAMES_LIST, TOTAL_ROUNDS } from './constants';
import { MostScoring } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, SEEDING, TASK, RESULT, GAME_OVER } = MEGAMIX_PHASES;
  const order = [RULES, SETUP, SEEDING, TASK, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    return triggerLastRound || (round.current > 0 && round.current) === round.total ? GAME_OVER : TASK;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TASK;
};

/**
 * Get random task list
 * @param includeAllMiniGameTypes
 * @param isFullGame
 * @returns
 */
export const getTaskList = (includeAllMiniGameTypes: boolean, isFullGame: boolean) => {
  const list = includeAllMiniGameTypes ? MINI_GAMES_LIST : MINI_GAMES_LIST.filter((game) => !game.upcoming);

  if (isFullGame) {
    return utils.game.shuffle(list);
  }

  return utils.game.getRandomItems(list, TOTAL_ROUNDS);
};

export const parseCrimeTiles = (sceneTiles: CrimeTile[]) => {
  const result = sceneTiles.reduce(
    (acc: any, tile: CrimeTile) => {
      if (tile.type === 'cause') {
        acc.causeOfDeathTile = tile;
      } else if (tile.type === 'evidence') {
        acc.reasonForEvidenceTile = tile;
      } else if (tile.type === 'location') {
        acc.locationTiles.push(tile);
      } else {
        if (tile.specific === 'weapon') {
          acc.weaponSceneTiles.push(tile);
        } else if (tile.specific === 'evidence') {
          acc.evidenceSceneTiles.push(tile);
        } else {
          acc.sceneTiles.push(tile);
        }
      }

      return acc;
    },
    {
      causeOfDeathTile: {},
      reasonForEvidenceTile: {},
      locationTiles: [],
      weaponSceneTiles: [],
      evidenceSceneTiles: [],
      sceneTiles: [],
    }
  );

  result.weaponSceneTiles = utils.game.shuffle(result.weaponSceneTiles);
  result.evidenceSceneTiles = utils.game.shuffle(result.evidenceSceneTiles);
  result.sceneTiles = utils.game.shuffle(result.sceneTiles);

  return {
    weapon: {
      scenes: {
        causeOfDeath: result.causeOfDeathTile,
        location: result.locationTiles[0],
        sceneA: result.weaponSceneTiles[0],
        sceneB: result.sceneTiles[0],
        sceneC: result.sceneTiles[1],
      },
      crime: {
        causeOfDeath: utils.game.getRandomNumber(0, 5),
        location: utils.game.getRandomNumber(0, 5),
        sceneA: utils.game.getRandomNumber(0, 5),
        sceneB: utils.game.getRandomNumber(0, 5),
        sceneC: utils.game.getRandomNumber(0, 5),
      },
    },
    evidence: {
      scenes: {
        reasonForEvidence: result.reasonForEvidenceTile,
        location: result.locationTiles[0],
        sceneA: result.evidenceSceneTiles[0],
        sceneB: result.sceneTiles[2],
        sceneC: result.sceneTiles[3],
      },
      crime: {
        reasonForEvidence: utils.game.getRandomNumber(0, 5),
        location: utils.game.getRandomNumber(0, 5),
        sceneA: utils.game.getRandomNumber(0, 5),
        sceneB: utils.game.getRandomNumber(0, 5),
        sceneC: utils.game.getRandomNumber(0, 5),
      },
    },
  };
};

export const getMostVotes = (players: Players, property = 'cardId'): MostScoring => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Count all votes
  const counts: Record<string, number> = {};

  listOfPlayers.forEach((player) => {
    const vote = player.data[property];
    if (counts[vote] === undefined) {
      counts[vote] = 0;
    }
    counts[vote] += 1;
  });

  // Get max votes
  const maxVal = Math.max(...Object.values(counts));

  const winningValues: string[] = [];

  Object.keys(counts).forEach((key) => {
    if (counts[key] === maxVal) {
      winningValues.push(key);
    }
  });

  const winningTeam: string[] = [];
  const losingTeam: string[] = [];

  listOfPlayers.forEach((player) => {
    const vote = player.data[property];
    if (winningValues.includes(vote)) {
      winningTeam.push(player.id);
    } else {
      losingTeam.push(player.id);
    }
  });

  return {
    condition: 'mostVoted',
    winningTeam,
    losingTeam,
    winningValues,
  };
};

export const getMostMatching = (players: Players, property: string, acceptance = 0.6): MostScoring => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Count all votes
  const counts: Record<string, string[]> = {};

  listOfPlayers.forEach((player) => {
    const word = utils.helpers.stringRemoveAccents(player.data[property]);
    const countsList = Object.keys(counts);
    if (countsList.length === 0) {
      counts[word] = [player.data[property]];
      return;
    }

    for (let i = 0; i < countsList.length; i++) {
      const option = countsList[i];
      const similarity = stringSimilarity.compareTwoStrings(option, word);
      if (similarity >= acceptance) {
        counts[option].push(player.data[property]);
        return;
      }
    }
    counts[word] = [player.data[property]];
  });

  // Get lengths of all counts entries
  const lengths = Object.values(counts).reduce((acc: number[], arr) => {
    acc.push(arr.length);
    return acc;
  }, []);

  // Get max votes
  const maxVal = Math.max(...lengths);
  const winningValues = Object.values(counts).reduce((acc, arr) => {
    if (arr.length === maxVal) {
      acc = [...acc, ...arr];
    }
    return acc;
  }, []);

  const winningTeam: string[] = [];
  const losingTeam: string[] = [];

  listOfPlayers.forEach((player) => {
    const word = player.data[property];
    if (winningValues.includes(word)) {
      winningTeam.push(player.id);
    } else {
      losingTeam.push(player.id);
    }
  });

  return {
    condition: 'stringMatch',
    winningTeam,
    losingTeam,
    winningValues,
  };
};

export const getRanking = (
  players: Players,
  scoring: MostScoring
  // store: FirebaseStoreData
): NewScore[] => {
  // Gained points: [already on Winning team, joining Winning team]
  const scores = new utils.players.Scores(players, [0, 0]);

  utils.players.getListOfPlayers(players).forEach((player) => {
    // Is on the new winning team
    if (scoring.winningTeam.includes(player.id)) {
      // Was in the winning team
      if (player.team === 'W') {
        scores.add(player.id, 2, 0);
        // TODO: achievement stayed winning
      } else {
        scores.add(player.id, 1, 1);
        player.team = 'W';
        // TODO: achievement joined winning
      }
    } else {
      // Was in the winning team
      if (player.team === 'W') {
        player.team = 'L';
        // TODO: achievement left winning
      } else {
        // TODO: achievement stayed losing
      }
    }
  });

  return scores.rank(players);
};
