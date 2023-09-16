import stringSimilarity from 'string-similarity';
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import { buildDecks } from '../na-rua-do-medo/helpers';
import { HouseCard } from '../na-rua-do-medo/types';
import { MEGAMIX_PHASES, WINNING_CONDITION } from './constants';
import { AvailableTrack, MostScoring, Track, TrackCandidate } from './types';
import { orderBy } from 'lodash';

/**
 * Get the next phase based on the current one
 * @param currentPhase - current phase
 * @param round - round data
 * @returns next phase
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, SEEDING, TRACK, RESULT, GAME_OVER } = MEGAMIX_PHASES;
  const order = [RULES, SETUP, SEEDING, TRACK, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    return round.forceLastRound || (round.current > 0 && round.current) === round.total ? GAME_OVER : TRACK;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TRACK;
};

/**
 * Distribute seeds to players
 * @param tracks
 * @param players
 * @param clubberIds
 */
export const distributeSeeds = (tracks: Track[], players: Players, clubberIds: string[]) => {
  const individualSeeds: any[] = [];
  const groupSeeds: any[] = [];
  const playersList = utils.game.shuffle(utils.players.getListOfPlayers(players));
  const playerCount = playersList.length;

  tracks.forEach((track) => {
    switch (track.game) {
      case GAME_NAMES.ARTE_RUIM:
        if (track.variant === 'cards') {
          individualSeeds.push({
            type: GAME_NAMES.ARTE_RUIM,
            card: utils.game.getRandomItem(track.data.cards),
          });
          break;
        }
        individualSeeds.push({
          type: GAME_NAMES.ARTE_RUIM,
          card: track.data.cards[0],
        });
        individualSeeds.push({
          type: GAME_NAMES.ARTE_RUIM,
          card: track.data.cards[1],
        });
        if (track.data.cards[2]) {
          individualSeeds.push({
            type: GAME_NAMES.ARTE_RUIM,
            card: track.data.cards[2],
          });
        }
        break;

      case GAME_NAMES.CONTADORES_HISTORIAS:
        individualSeeds.push({
          type: GAME_NAMES.CONTADORES_HISTORIAS,
          prompts: track.data.prompts,
          cards: track.data.cards,
        });
        break;

      case GAME_NAMES.LABIRINTO_SECRETO:
        individualSeeds.push({
          type: GAME_NAMES.LABIRINTO_SECRETO,
          tree: track.data.trees[0],
          cards: track.data.adjectives.slice(0, 3),
        });
        individualSeeds.push({
          type: GAME_NAMES.LABIRINTO_SECRETO,
          tree: track.data.trees[1],
          cards: track.data.adjectives.slice(3, 6),
        });
        individualSeeds.push({
          type: GAME_NAMES.LABIRINTO_SECRETO,
          tree: track.data.trees[2],
          cards: track.data.adjectives.slice(6, 9),
        });
        break;

      case GAME_NAMES.ONDA_TELEPATICA:
        individualSeeds.push({
          type: GAME_NAMES.ONDA_TELEPATICA,
          card: Math.random() > 0.5 ? track.data.card.left : track.data.card.right,
        });
        break;

      case GAME_NAMES.POLEMICA_DA_VEZ:
        groupSeeds.push({
          type: GAME_NAMES.POLEMICA_DA_VEZ,
          card: track.data.card,
        });
        break;

      case GAME_NAMES.RETRATO_FALADO:
        individualSeeds.push({
          type: GAME_NAMES.RETRATO_FALADO,
          card: track.data.card,
        });
        individualSeeds.push({
          type: GAME_NAMES.RETRATO_FALADO,
          card: track.data.card,
        });
        individualSeeds.push({
          type: GAME_NAMES.RETRATO_FALADO,
          card: track.data.card,
        });
        break;

      case GAME_NAMES.UE_SO_ISSO:
        individualSeeds.push({
          type: GAME_NAMES.UE_SO_ISSO,
          card: track.data.cards[0],
        });
        individualSeeds.push({
          type: GAME_NAMES.UE_SO_ISSO,
          card: track.data.cards[1],
        });
        individualSeeds.push({
          type: GAME_NAMES.UE_SO_ISSO,
          card: track.data.cards[2],
        });
        if (playerCount > 5) {
          individualSeeds.push({
            type: GAME_NAMES.UE_SO_ISSO,
            card: track.data.cards[0],
          });
          individualSeeds.push({
            type: GAME_NAMES.UE_SO_ISSO,
            card: track.data.cards[1],
          });
          individualSeeds.push({
            type: GAME_NAMES.UE_SO_ISSO,
            card: track.data.cards[2],
          });
        }
        break;

      default:
      // do nothing
    }
  });

  playersList.forEach((player) => {
    player.seeds = [];
  });

  individualSeeds.forEach((seed, index) => {
    const player = playersList[index % playersList.length];
    player.seeds.push(seed);
  });

  const clubbers = utils.game.sliceIntoChunks(
    clubberIds,
    Math.min(Math.floor(clubberIds.length / playersList.length), 5)
  );

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

/**
 * Parse seeds into game track data
 * @param tracks
 * @param players
 * @returns
 */
export const handleSeedingData = (tracks: Track[], players: Players) => {
  tracks.forEach((track) => {
    switch (track.game) {
      case GAME_NAMES.ARTE_RUIM:
        if (track.variant === 'cards') {
          track.data.option = buildArteRuimCardOptions(players, track);
          break;
        }

        track.data.options = buildArteRuimDrawingsOptions(players, track);
        break;

      case GAME_NAMES.LABIRINTO_SECRETO:
        track.data.options = buildLabirintoSecretoOptions(players, track);
        break;

      case GAME_NAMES.ONDA_TELEPATICA:
        track.data.option = buildOndaTelepaticaOptions(players);

        break;

      case GAME_NAMES.POLEMICA_DA_VEZ:
        track.data.options = buildPolemicaDaVezOptions(players);
        break;

      case GAME_NAMES.RETRATO_FALADO:
        track.data.options = buildRetratoFaladoOptions(players, track);
        break;

      case GAME_NAMES.UE_SO_ISSO:
        track.data.cards = utils.game.getRandomItems(track.data.cards, 2);
        track.data.options = buildUeSoIssoOptions(players);
        break;

      default:
      // do nothing
    }
  });

  return tracks;
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
  const correctPercentage = Math.round((totalLikes / playerCount) * 100);

  const possibleLikes = utils.game.makeArray(playerCount, 1).map((v) => Math.round((v * 100) / playerCount));

  return orderBy([...new Set([0, correctPercentage, 100, ...utils.game.getRandomItems(possibleLikes, 3)])]);
};

const buildRetratoFaladoOptions = (players: Players, track: Track) => {
  return utils.players.getListOfPlayers(players).reduce((acc: PlainObject[], player) => {
    if (player.data[track.data.card.id]) {
      acc.push({
        playerId: player.id,
        drawing: player.data[track.data.card.id],
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

const buildUeSoIssoOptions = (players: Players) => {
  // Choose one card to be the card result
  const clues: string[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.data.singleClue) {
      clues.push(player.data.singleClue.trim().toLowerCase());
    }
  });

  return utils.game.getRandomItems([...new Set(clues)], Math.min(5, clues.length));
};

/**
 * Find the one drawing
 * @param players
 * @param track
 * @returns
 */
const buildArteRuimCardOptions = (players: Players, track: Track) => {
  const cardIds: CardId[] = track.data.cards.map((card: TextCard) => card.id);
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
 * @param track
 * @returns
 */
const buildArteRuimDrawingsOptions = (players: Players, track: Track) => {
  const cardIds: CardId[] = track.data.cards.map((card: TextCard) => card.id);
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
 * Get the 3 tree clues in order, add two random options, shuffle everything
 * @param players
 * @param track
 * @returns
 */
const buildLabirintoSecretoOptions = (players: Players, track: Track) => {
  const treeIds: CardId[] = track.data.trees.map((tree: TextCard) => tree.id);

  const clues: PlainObject[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.data).forEach((dataKey) => {
      if (treeIds.includes(dataKey)) {
        clues[treeIds.indexOf(dataKey)] = {
          text:
            track.data.adjectives.find((adjective) => adjective.id === player.data[dataKey]).text ?? '???',
          playerId: player.id,
          treeId: dataKey,
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

export const getCandidateOnList = (list: TrackCandidate[], name: string): TrackCandidate | undefined => {
  return list.find((game) => game && game.game === name);
};

export const getGameOnList = (list: AvailableTrack[], gameName: string): AvailableTrack[] => {
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
