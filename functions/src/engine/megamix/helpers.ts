import stringSimilarity from 'string-similarity';
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import { buildDecks } from '../na-rua-do-medo/helpers';
import { HouseCard } from '../na-rua-do-medo/types';
import { MEGAMIX_PHASES, MINI_GAMES_LIST, TOTAL_ROUNDS, WINNING_CONDITION } from './constants';
import { AvailableTask, MostScoring, Task } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, SEEDING, TASK, RESULT, GAME_OVER } = MEGAMIX_PHASES;
  const order = [RULES, SETUP, SEEDING, TASK, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    return round.forceLastRound || (round.current > 0 && round.current) === round.total ? GAME_OVER : TASK;
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

  let scoringType = 'NORMAL';
  if (winningValues.length > 1) scoringType = 'TIE';
  if (Object.keys(counts).length === listOfPlayers.length) scoringType = 'DRAW';

  return {
    condition: WINNING_CONDITION.MOST_VOTED,
    winningTeam,
    losingTeam,
    winningValues,
    scoringType: scoringType as MostScoring['scoringType'],
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
  const winningUniqueValues: string[] = [];
  const winningValues = utils.helpers.flattenArray(
    Object.keys(counts).reduce((acc: string[][], key) => {
      const arr = counts[key];
      if (arr.length === maxVal) {
        acc.push(arr);
        winningUniqueValues.push(key);
      }
      return acc;
    }, [])
  );

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

  let scoringType = 'NORMAL';
  if (winningUniqueValues.length > 1) scoringType = 'TIE';
  if (Object.keys(counts).length === listOfPlayers.length) scoringType = 'DRAW';

  return {
    condition: WINNING_CONDITION.STRING_MATCH,
    winningTeam,
    losingTeam,
    winningValues: [...new Set(winningValues)],
    scoringType: scoringType as MostScoring['scoringType'],
  };
};

export const getRanking = (
  players: Players,
  scoring: MostScoring,
  currentRound: number
  // store: FirebaseStoreData
): NewScore[] => {
  // Gained points: [already on Winning team, joining Winning team]
  const scores = new utils.players.Scores(players, [0, 0]);

  // Full on tie, nobody scores, everybody is kicked out
  if (scoring.scoringType === 'DRAW') {
    utils.players.getListOfPlayers(players).forEach((player) => {
      player.team.push('L');
    });
    return scores.rank(players);
  }

  utils.players.getListOfPlayers(players).forEach((player) => {
    const previousTeam = player.team[currentRound - 1];
    if (scoring.scoringType === 'TIE') {
      // Is on the new winning team
      if (scoring.winningTeam.includes(player.id)) {
        // Was in the winning team
        if (previousTeam === 'W') {
          scores.add(player.id, 2, 0);
          player.team.push('W');
          // TODO: achievement stayed winning
        } else {
          player.team.push('L');
          // TODO: achievement joined winning
        }
      } else {
        // Was in the winning team
        if (previousTeam === 'W') {
          player.team.push('L');
          // TODO: achievement left winning
        } else {
          player.team.push('L');
          // TODO: achievement stayed losing
        }
      }
    } else {
      // Is on the new winning team
      if (scoring.winningTeam.includes(player.id)) {
        // Was in the winning team
        if (previousTeam === 'W') {
          scores.add(player.id, 2, 0);
          player.team.push('W');
          // TODO: achievement stayed winning
        } else {
          scores.add(player.id, 1, 1);
          player.team.push('W');
          // TODO: achievement joined winning
        }
      } else {
        // Was in the winning team
        if (previousTeam === 'W') {
          player.team.push('L');
          // TODO: achievement left winning
        } else {
          player.team.push('L');
          // TODO: achievement stayed losing
        }
      }
    }
  });

  return scores.rank(players);
};

export const getCandidatePersonality = (cards: DatingCandidateCard[]) => {
  const interests: DatingCandidateCard[] = [];
  const needs: DatingCandidateCard[] = [];
  const funFacts: DatingCandidateCard[] = [];

  cards.forEach((card) => {
    if (card.type === 'fun-fact') {
      funFacts.push(card);
    } else if (card.type === 'interest') {
      interests.push(card);
    } else if (card.type === 'need') {
      needs.push(card);
    }
  });

  return {
    interests: utils.game.getRandomItems(interests, 3),
    needs: utils.game.getRandomItems(needs, 3),
    funFacts: utils.game.getRandomItems(funFacts, 3),
  };
};

export const distributeSeeds = (tasks: Task[], players: Players, clubberIds: string[]) => {
  const individualSeeds: any[] = [];
  const groupSeeds: any[] = [];

  tasks.forEach((task) => {
    switch (task.game) {
      case GAME_NAMES.ARTE_RUIM:
        if (task.variant === 'cards') {
          individualSeeds.push({
            type: GAME_NAMES.ARTE_RUIM,
            card: utils.game.getRandomItem(task.data.cards),
          });
          break;
        }
        individualSeeds.push({
          type: GAME_NAMES.ARTE_RUIM,
          card: task.data.cards[0],
        });
        individualSeeds.push({
          type: GAME_NAMES.ARTE_RUIM,
          card: task.data.cards[1],
        });
        if (task.data.cards[2]) {
          individualSeeds.push({
            type: GAME_NAMES.ARTE_RUIM,
            card: task.data.cards[2],
          });
        }
        break;

      case GAME_NAMES.CAMINHOS_MAGICOS:
        individualSeeds.push({
          type: GAME_NAMES.CAMINHOS_MAGICOS,
          portal: task.data.portals[0],
          cards: task.data.adjectives.slice(0, 3),
        });
        individualSeeds.push({
          type: GAME_NAMES.CAMINHOS_MAGICOS,
          portal: task.data.portals[1],
          cards: task.data.adjectives.slice(3, 6),
        });
        individualSeeds.push({
          type: GAME_NAMES.CAMINHOS_MAGICOS,
          portal: task.data.portals[2],
          cards: task.data.adjectives.slice(6, 9),
        });
        break;

      case GAME_NAMES.FILEIRA_DE_FATOS:
        individualSeeds.push({
          type: GAME_NAMES.FILEIRA_DE_FATOS,
          card: task.data.card,
        });
        individualSeeds.push({
          type: GAME_NAMES.FILEIRA_DE_FATOS,
          card: task.data.card,
        });
        individualSeeds.push({
          type: GAME_NAMES.FILEIRA_DE_FATOS,
          card: task.data.card,
        });
        break;

      case GAME_NAMES.ONDA_TELEPATICA:
        individualSeeds.push({
          type: GAME_NAMES.ONDA_TELEPATICA,
          card: task.data.card,
        });
        break;

      case GAME_NAMES.POLEMICA_DA_VEZ:
        groupSeeds.push({
          type: GAME_NAMES.POLEMICA_DA_VEZ,
          card: task.data.card,
        });
        break;

      case GAME_NAMES.RETRATO_FALADO:
        individualSeeds.push({
          type: GAME_NAMES.RETRATO_FALADO,
          card: task.data.card,
        });
        individualSeeds.push({
          type: GAME_NAMES.RETRATO_FALADO,
          card: task.data.card,
        });
        individualSeeds.push({
          type: GAME_NAMES.RETRATO_FALADO,
          card: task.data.card,
        });
        break;

      default:
      // do nothing
    }
  });

  const playersList = utils.players.getListOfPlayers(players);

  playersList.forEach((player) => {
    player.seeds = [];
  });

  individualSeeds.forEach((seed, index) => {
    const player = playersList[index % playersList.length];
    player.seeds.push(seed);
  });

  const clubbers = utils.game.sliceIntoChunks(clubberIds, 5);

  playersList.forEach((player, index) => {
    groupSeeds.forEach((seed) => {
      player.seeds.push(seed);
    });

    player.seeds.push({
      type: 'clubber',
      outfits: clubbers[index],
    });
  });
};

export const handleSeedingData = (tasks: Task[], players: Players) => {
  tasks.forEach((task) => {
    switch (task.game) {
      case GAME_NAMES.ARTE_RUIM:
        if (task.variant === 'cards') {
          task.data.option = buildArteRuimCardOptions(players, task);
          break;
        }

        task.data.options = buildArteRuimDrawingsOptions(players, task);
        break;

      case GAME_NAMES.CAMINHOS_MAGICOS:
        task.data.options = buildCaminhosMagicosOptions(players, task);
        break;

      case GAME_NAMES.FILEIRA_DE_FATOS:
        task.data.options = buildFileiraDeFatosOptions(players);
        break;

      case GAME_NAMES.ONDA_TELEPATICA:
        task.data.option = buildOndaTelepaticaOptions(players);

        break;

      case GAME_NAMES.POLEMICA_DA_VEZ:
        task.data.options = buildPolemicaDaVezOptions(players);
        break;

      case GAME_NAMES.RETRATO_FALADO:
        task.data.options = buildRetratoFaladoOptions(players, task);
        break;

      default:
      // do nothing
    }
  });

  return tasks;
};

/**
 * Gather likes, count likes, return a array with 3 possible answers (total likes), always including the correct one
 * @param players
 */
const buildPolemicaDaVezOptions = (players: Players) => {
  const playerCount = utils.players.getPlayerCount(players);
  const totalLikes = utils.players
    .getListOfPlayers(players)
    .map((player) => player.data.likeTopic)
    .reduce((acc: number, like) => {
      if (like) {
        acc += 1;
      }
      return acc;
    }, 0);

  const possibleLikes = utils.game.makeArray(playerCount + 1);

  return [...new Set([totalLikes, ...utils.game.getRandomItems(possibleLikes, 3)])].sort();
};

/**
 * Gather facts, order them
 * @param players
 */
const buildFileiraDeFatosOptions = (players: Players) => {
  const allFacts = utils.players.getListOfPlayers(players).reduce((acc: PlainObject[], player) => {
    if (player.data.fact !== undefined) {
      acc.push({
        playerId: player.id,
        value: player.data.fact,
      });
    }
    return acc;
  }, []);

  const ordered = utils.helpers.orderBy(allFacts, 'value', 'asc');

  if (Math.random() > 0.5) {
    return [ordered[0], ordered[1], ordered[2]];
  }

  return [ordered[2], ordered[0], ordered[1]];
};

const buildRetratoFaladoOptions = (players: Players, task: Task) => {
  return utils.players.getListOfPlayers(players).reduce((acc: PlainObject[], player) => {
    if (player.data[task.data.card.id]) {
      acc.push({
        playerId: player.id,
        drawing: player.data[task.data.card.id],
      });
    }
    return acc;
  }, []);
};

const buildOndaTelepaticaOptions = (players: Players) => {
  const player = utils.players.getListOfPlayers(players).find((p) => p.data.wave);

  return {
    playerId: player?.id ?? 'Bug!',
    value: player?.data?.wave ?? 'Bug!',
  };
};

/**
 * Find the one drawing
 * @param players
 * @param task
 * @returns
 */
const buildArteRuimCardOptions = (players: Players, task: Task) => {
  const cardIds: CardId[] = task.data.cards.map((card: TextCard) => card.id);
  const drawing = {
    drawing: '[]',
    playerId: 'Bug!',
  };
  utils.players.getListOfPlayers(players).forEach((player) => {
    cardIds.forEach((cardId) => {
      if (player.data[cardId]) {
        drawing.drawing = player.data[cardId];
        drawing.playerId = player.id;
      }
    });
  });

  return drawing;
};

/**
 * Find the 2 or 3 drawings
 * @param players
 * @param task
 * @returns
 */
const buildArteRuimDrawingsOptions = (players: Players, task: Task) => {
  const cardIds: CardId[] = task.data.cards.map((card: TextCard) => card.id);
  const drawings: PlainObject[] = [];

  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.data).forEach((dataKey) => {
      if (cardIds.includes(dataKey)) {
        drawings.push({
          drawing: player.data[dataKey],
          playerId: player.id,
        });
      }
    });
  });

  return drawings;
};

/**
 * Get the 3 portal clues in order, add two random options, shuffle everything
 * @param players
 * @param task
 * @returns
 */
const buildCaminhosMagicosOptions = (players: Players, task: Task) => {
  const portalIds: CardId[] = task.data.portals.map((portal) => portal.id);

  const clues: PlainObject[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.data).forEach((dataKey) => {
      if (portalIds.includes(dataKey)) {
        clues[portalIds.indexOf(dataKey)] = {
          text: task.data.adjectives.find((adjective) => adjective.id === player.data[dataKey]).text ?? '???',
          playerId: player.id,
          portalId: dataKey,
        };
      }
    });
  });

  const permutations = utils.game.shuffle([
    [clues[0], clues[2], clues[1]],
    [clues[1], clues[2], clues[0]],
    [clues[1], clues[0], clues[2]],
    [clues[2], clues[0], clues[1]],
    [clues[2], clues[1], clues[0]],
  ]);

  const options = utils.game.shuffle([[clues[0], clues[1], clues[2]], permutations[0], permutations[1]]);

  return {
    0: options[0],
    1: options[1],
    2: options[2],
  };
};

export const getGameOnList = (list: AvailableTask[], gameName: string): AvailableTask[] => {
  return list.filter((game) => game.game === gameName);
};

export const getNaRuaDoMedoScenario = (playerCount: number) => {
  const decks = buildDecks(true);
  const [lowCandy, mediumCandy, highCandy] = decks.candyDeck.reduce(
    (acc: [HouseCard[], HouseCard[], HouseCard[]], card) => {
      // Low cards are 4 or less or less than players - 2
      if (card.value < 4 || card.value <= playerCount - 2) {
        acc[0].push(card);
      } else if (card.value > 10) {
        acc[2].push(card);
      } else {
        acc[1].push(card);
      }

      return acc;
    },
    [[], [], []]
  );
  const horrorDeck = decks.horrorDeck.reduce((acc: HouseCard[], monster) => {
    if (!acc.some((m) => m.key === monster.key)) {
      acc.push(monster);
    }
    return acc;
  }, []);

  const scenarios: HouseCard[][] = [];
  // Scenarios
  // 1) 3 monsters, 1 low card, 1 jackpot
  scenarios.push([
    ...utils.game.getRandomItems(horrorDeck, 3),
    ...utils.game.getRandomItems(lowCandy, 1),
    ...utils.game.getRandomItems(decks.jackpotDeck, 1),
  ]);
  // 2) 2 monsters, 2 low card, 1 medium cards
  scenarios.push([
    ...utils.game.getRandomItems(horrorDeck, 2),
    ...utils.game.getRandomItems(lowCandy, 2),
    ...utils.game.getRandomItems(mediumCandy, 1),
  ]);
  // 3) 3 monsters, 2 medium cards
  scenarios.push([...utils.game.getRandomItems(horrorDeck, 3), ...utils.game.getRandomItems(mediumCandy, 2)]);
  // 4) 1 monster, 4 low cards
  scenarios.push([...utils.game.getRandomItems(horrorDeck, 1), ...utils.game.getRandomItems(lowCandy, 4)]);
  // 5) 2 monsters, 1 low, 2 high
  scenarios.push([
    ...utils.game.getRandomItems(horrorDeck, 2),
    ...utils.game.getRandomItems(lowCandy, 1),
    ...utils.game.getRandomItems(highCandy, 2),
  ]);

  return {
    scenarios: utils.game.shuffle(scenarios),
    home: [
      utils.game.getRandomItem(decks.horrorDeck),
      ...utils.game.getRandomItems([...decks.candyDeck, utils.game.getRandomItem(decks.jackpotDeck)], 2),
    ],
    costumes: utils.game.getRandomItems(utils.game.makeArray(14), playerCount),
    kids: utils.game.getRandomItems(utils.game.makeArray(14), 5),
  };
};

export const getMovieReviews = (reviews: MovieReviewCard[]) => {
  const [good, bad] = reviews.reduce(
    (acc: [MovieReviewCard[], MovieReviewCard[]], entry) => {
      acc[entry.type === 'good' ? 0 : 1].push(entry);

      return acc;
    },
    [[], []]
  );

  return {
    good: utils.game.getRandomItem(good),
    bad: utils.game.getRandomItem(bad),
  };
};
