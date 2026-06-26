import { cloneDeep, orderBy, random, sample, sampleSize, shuffle, uniq } from 'lodash';
// Types
import type {
  CrimeSceneTileData,
  DatingCandidateCardData,
  MovieReviewCardData,
  TextCardData,
} from '../../types/tdr';
import type { HouseCard } from '../na-rua-do-medo/types';
import type { AvailableTrack, FirebaseStoreData, MostScoring, Track, TrackCandidate } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { AVATAR_SPRITE_LIBRARIES } from '../../constants/sprites';
import {
  MEGAMIX_PHASES,
  PARTY_GAMES,
  PARTY_GAMES_NAMES,
  PARTY_TRACKS,
  SIDES,
  TOTAL_ROUNDS,
  WINNING_CONDITION,
} from './constants';
// Mechanics
import { getListOfPlayers, getListOfPlayersIds, getPlayerCount } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Utils
import { compareTwoStrings, makeArray, sliceIntoChunks, stringRemoveAccents } from '../../utils';
// Internal
import { buildDecks } from '../na-rua-do-medo/helpers';
import { increaseAchievement, pushAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, SEEDING, TRACK, RESULT, GAME_OVER } = MEGAMIX_PHASES;
  const order = [SETUP, SEEDING, TRACK, RESULT, GAME_OVER];

  if (currentPhase === RESULT) {
    return round.forceLastRound || (round.current > 0 && round.current) === round.total ? GAME_OVER : TRACK;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Distribute seeds to players
 * @param tracks
 * @param players
 * @param clubberIds
 */
export const distributeSeeds = (
  tracks: Track[],
  players: Players,
  clubberIds: string[],
  partyMode: boolean,
) => {
  const individualSeeds: any[] = [];
  const groupSeeds: any[] = [];
  const playersList = shuffle(getListOfPlayers(players));
  const playerCount = playersList.length;

  tracks.forEach((track) => {
    switch (track.game) {
      case GAME_NAMES.ARTE_RUIM:
        if (track.variant === 'cards') {
          individualSeeds.push({
            type: GAME_NAMES.ARTE_RUIM,
            card: sample(track.data.cards),
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
          card: sample(track.data.cards),
          prompts: track.data.prompts,
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

      case GAME_NAMES.MENTE_COLETIVA:
        individualSeeds.push({
          type: GAME_NAMES.MENTE_COLETIVA,
          card: track.data.question,
        });
        individualSeeds.push({
          type: GAME_NAMES.MENTE_COLETIVA,
          card: track.data.question,
        });
        individualSeeds.push({
          type: GAME_NAMES.MENTE_COLETIVA,
          card: track.data.question,
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

  // Boilerplate seeds
  playersList.forEach((player) => {
    player.seeds = [];
  });

  // Party mode
  // Count players and distribute the questions, each question should go to 3 players, and each player should get a maximum of 5 questions
  if (partyMode) {
    const customQuestionLimit = playerCount * 3;
    let customQuestionCount = playerCount;
    let customSeedIndex = 0;

    const customIndividualTracks: any[] = makeArray(playerCount).map(() => {
      return cloneDeep({
        type: 'party',
        cards: [],
      });
    });

    const increaseCustomSeedIndex = () => {
      customSeedIndex += 1;
      customQuestionCount += 1;
      if (customSeedIndex >= customIndividualTracks.length) {
        customSeedIndex = 0;
      }
    };

    PARTY_TRACKS.forEach((track) => {
      if (track.game === PARTY_GAMES.WHO_SAID_THIS) {
        customIndividualTracks.forEach((customTrack) => {
          customTrack.cards.push(track.card);
        });
        return;
      }

      // Skip other party games if player count is over 8
      if (playerCount > 8) {
        return;
      }

      if (customQuestionCount < customQuestionLimit) {
        if (track.game === PARTY_GAMES.CUSTOM_THIS_THAT) {
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
        }

        if (track.game === PARTY_GAMES.CUSTOM_BEST_OF_THREE) {
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
          customIndividualTracks[customSeedIndex].cards.push(track.card);
          increaseCustomSeedIndex();
        }
      }
    });

    customIndividualTracks.forEach((seed, index) => {
      const player = playersList[index];
      player.seeds.push(seed);
    });
  }

  individualSeeds.forEach((seed, index) => {
    const player = playersList[index % playersList.length];
    player.seeds.push(seed);
  });

  const clubbers = sliceIntoChunks(
    clubberIds,
    Math.min(Math.floor(clubberIds.length / playersList.length), 5),
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
 * Distributes tracks evenly by game type
 * @param tracks - all available tracks
 * @param count - number of tracks needed
 * @param playerCount - number of players in the game
 * @returns evenly distributed tracks with the last track not being a party track (unless 15 players)
 */
const distributeTracksEvenly = (tracks: Track[], count: number, playerCount: number): Track[] => {
  // Group tracks by game type
  const tracksByGame: Record<string, Track[]> = {};

  tracks.forEach((track) => {
    if (!tracksByGame[track.game]) {
      tracksByGame[track.game] = [];
    }
    tracksByGame[track.game].push(track);
  });

  // Shuffle each group internally for variety
  Object.keys(tracksByGame).forEach((gameType) => {
    tracksByGame[gameType] = shuffle(tracksByGame[gameType]);
  });

  const gameTypes = Object.keys(tracksByGame);
  const result: Track[] = [];
  let currentGameIndex = 0;

  // Distribute evenly in round-robin fashion
  while (result.length < count) {
    const gameType = gameTypes[currentGameIndex % gameTypes.length];

    if (tracksByGame[gameType] && tracksByGame[gameType].length > 0) {
      const track = tracksByGame[gameType].shift();
      if (track) {
        result.push(track);
      }
    }

    currentGameIndex++;

    // Safety check to prevent infinite loop if we run out of tracks
    if (gameTypes.every((gt) => !tracksByGame[gt] || tracksByGame[gt].length === 0)) {
      break;
    }
  }

  // Ensure last track is not WHO_SAID_THIS unless there are 15 players
  if (result.length > 0 && playerCount < 15) {
    const lastTrack = result[result.length - 1];
    const whoSaidThisName = PARTY_GAMES_NAMES[PARTY_GAMES.WHO_SAID_THIS];

    if (lastTrack.game === whoSaidThisName) {
      // Find a non-WHO_SAID_THIS track to swap with (preferably from earlier positions)
      const swapIndex = result.findIndex((track) => track.game !== whoSaidThisName);
      if (swapIndex !== -1) {
        // Swap the tracks
        [result[swapIndex], result[result.length - 1]] = [result[result.length - 1], result[swapIndex]];
      }
    }
  }

  return result;
};

/**
 * Parse seeds into game track data
 * @param tracks
 * @param players
 * @returns
 */
export const handleSeedingData = (
  tracks: Track[],
  players: Players,
  partyMode: boolean,
  language: Language,
) => {
  tracks.forEach((track) => {
    switch (track.game) {
      case GAME_NAMES.ARTE_RUIM:
        if (track.variant === 'cards') {
          track.data.option = buildArteRuimCardOptions(players, track);
          break;
        }

        track.data.options = buildArteRuimDrawingsOptions(players, track);
        break;

      case GAME_NAMES.CONTADORES_HISTORIAS:
        track.data.prompt = buildContadoresHistoriasOptions(players);
        delete track.data.prompts;
        break;

      case GAME_NAMES.LABIRINTO_SECRETO:
        track.data.options = buildLabirintoSecretoOptions(players, track);
        break;

      case GAME_NAMES.MENTE_COLETIVA:
        track.data.options = buildMenteColetivaOptions(players);
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
        track.data.cards = sampleSize(track.data.cards, 2);
        track.data.options = buildUeSoIssoOptions(players);
        break;

      default:
      // do nothing
    }
  });

  const playerCount = getPlayerCount(players);
  // Build party tracks
  if (partyMode) {
    const partyTracks = buildPartyOptions(players, language);

    const tracksNeeded = Math.max(TOTAL_ROUNDS - partyTracks.length, 0);
    for (let i = 0; i < tracksNeeded; i++) {
      partyTracks.push(tracks[i]);
    }

    return distributeTracksEvenly(partyTracks, TOTAL_ROUNDS, playerCount);
  }
  return distributeTracksEvenly(tracks, TOTAL_ROUNDS, playerCount);
};

export const parseCrimeTiles = (sceneTiles: CrimeSceneTileData[]) => {
  const result = sceneTiles.reduce(
    (acc: PlainObject, tile) => {
      if (tile.type === 'cause') {
        acc.causeOfDeathTile = tile;
      } else if (tile.type === 'evidence') {
        acc.reasonForEvidenceTile = tile;
      } else if (tile.type === 'location') {
        acc.locationTile = tile;
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
      locationTile: [],
      weaponSceneTiles: [],
      evidenceSceneTiles: [],
      sceneTiles: [],
    },
  );

  result.weaponSceneTiles = shuffle(result.weaponSceneTiles);
  result.evidenceSceneTiles = shuffle(result.evidenceSceneTiles);
  result.sceneTiles = shuffle(result.sceneTiles);

  return {
    weapon: {
      scenes: {
        causeOfDeath: result.causeOfDeathTile,
        location: result.locationTile,
        sceneA: result.weaponSceneTiles[0],
        sceneB: result.sceneTiles[0],
        sceneC: result.sceneTiles[1],
      },
      crime: {
        causeOfDeath: random(0, 5),
        location: random(0, 5),
        sceneA: random(0, 5),
        sceneB: random(0, 5),
        sceneC: random(0, 5),
      },
    },
    evidence: {
      scenes: {
        reasonForEvidence: result.reasonForEvidenceTile,
        location: result.locationTile,
        sceneA: result.evidenceSceneTiles[0],
        sceneB: result.sceneTiles[2],
        sceneC: result.sceneTiles[3],
      },
      crime: {
        reasonForEvidence: random(0, 5),
        location: random(0, 5),
        sceneA: random(0, 5),
        sceneB: random(0, 5),
        sceneC: random(0, 5),
      },
    },
  };
};

export const getMostVotes = (players: Players, property = 'cardId'): MostScoring => {
  const listOfPlayers = getListOfPlayers(players);
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

export const getRanking = (players: Players, scoring: MostScoring, currentRound: number): NewScore[] => {
  // Gained points: [already on Winning team, joining Winning team]
  const scores = new Scores(players, [0, 0]);

  // Full on tie, nobody scores, everybody is kicked out
  if (scoring.scoringType === 'DRAW') {
    getListOfPlayers(players).forEach((player) => {
      player.team.push(SIDES.LOSER);
    });
    return scores.rank(players);
  }

  getListOfPlayers(players).forEach((player) => {
    const previousTeam = player.team[currentRound - 1];
    if (scoring.scoringType === 'TIE') {
      // Is on the new winning team
      if (scoring.winningTeam.includes(player.id)) {
        // Was in the winning team
        if (previousTeam === SIDES.WINNER) {
          scores.add(player.id, 2, 0);
          player.team.push(SIDES.WINNER);
        } else {
          player.team.push(SIDES.LOSER);
        }
      } else {
        // Was in the winning team
        if (previousTeam === SIDES.WINNER) {
          player.team.push(SIDES.LOSER);
        } else {
          player.team.push(SIDES.LOSER);
        }
      }
    } else {
      // Is on the new winning team
      if (scoring.winningTeam.includes(player.id)) {
        // Was in the winning team
        if (previousTeam === SIDES.WINNER) {
          scores.add(player.id, 2, 0);
          player.team.push(SIDES.WINNER);
        } else {
          scores.add(player.id, 1, 1);
          player.team.push(SIDES.WINNER);
        }
      } else {
        // Was in the winning team
        if (previousTeam === SIDES.WINNER) {
          player.team.push(SIDES.LOSER);
        } else {
          player.team.push(SIDES.LOSER);
        }
      }
    }
  });

  return scores.rank(players);
};

export const getCandidatePersonality = (cards: DatingCandidateCardData[]) => {
  const interests: DatingCandidateCardData[] = [];
  const needs: DatingCandidateCardData[] = [];
  const funFacts: DatingCandidateCardData[] = [];

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
    interests: sampleSize(interests, 3),
    needs: sampleSize(needs, 3),
    funFacts: sampleSize(funFacts, 3),
  };
};

export const buildContadoresHistoriasOptions = (players: Players) => {
  let prompt = '';
  getListOfPlayers(players).forEach((player) => {
    if (player.data.prompt) {
      prompt = player.data.prompt;
    }
  });
  return prompt;
};

export const buildMenteColetivaOptions = (players: Players) => {
  const answers: string[] = [];
  const sanitizedAnswers: string[] = [];
  getListOfPlayers(players).forEach((player) => {
    (player.data.answers ?? []).forEach((answer: string) => {
      const cleanedUpWork = stringRemoveAccents(answer);
      const similar = sanitizedAnswers.some((a) => {
        const similarity = compareTwoStrings(a, cleanedUpWork);
        return similarity >= 0.75;
      });
      if (!similar) {
        answers.push(answer);
        sanitizedAnswers.push(cleanedUpWork);
      }
    });
  });

  return answers.slice(0, 3);
};

/**
 * Gather likes, count likes, return a array with 3 possible answers (total likes), always including the correct one
 * @param players
 */
const buildPolemicaDaVezOptions = (players: Players) => {
  const playerCount = getPlayerCount(players);
  const totalLikes = getListOfPlayers(players)
    .map((player) => player.data.likeTweet)
    .reduce((acc: number, like) => {
      if (like) {
        return acc + 1;
      }
      return acc;
    }, 0);
  const correctPercentage = Math.round((totalLikes / playerCount) * 100);

  const possibleLikes = makeArray(playerCount, 1).map((v) => Math.round((v * 100) / playerCount));

  return orderBy([...new Set([0, correctPercentage, 100, ...sampleSize(possibleLikes, 3)])]);
};

const buildRetratoFaladoOptions = (players: Players, track: Track) => {
  return getListOfPlayers(players).reduce((acc: PlainObject[], player) => {
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
  const player = getListOfPlayers(players).find((p) => p.data.wave);

  return {
    playerId: player?.id ?? 'Bug!',
    value: player?.data?.wave ?? 'Bug!',
  };
};

const buildUeSoIssoOptions = (players: Players) => {
  // Choose one card to be the card result
  const clues: string[] = [];
  getListOfPlayers(players).forEach((player) => {
    if (player.data.singleClue) {
      clues.push(player.data.singleClue.trim().toLowerCase());
    }
  });

  return sampleSize([...new Set(clues)], Math.min(5, clues.length));
};

/**
 * Find the one drawing
 * @param players
 * @param track
 * @returns
 */
const buildArteRuimCardOptions = (players: Players, track: Track) => {
  const cardIds: UID[] = track.data.cards.map((card: TextCardData) => card.id);
  const drawing = {
    drawing: '[]',
    playerId: 'Bug!',
  };
  getListOfPlayers(players).forEach((player) => {
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
  const cardIds: UID[] = track.data.cards.map((card: TextCardData) => card.id);
  const drawings: PlainObject[] = [];

  getListOfPlayers(players).forEach((player) => {
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
  const treeIds: UID[] = track.data.trees.map((tree: TextCardData) => tree.id);

  const clues: PlainObject[] = [];
  getListOfPlayers(players).forEach((player) => {
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

  const permutations = shuffle([
    [clues[0], clues[2], clues[1]],
    [clues[1], clues[2], clues[0]],
    [clues[1], clues[0], clues[2]],
    [clues[2], clues[0], clues[1]],
    [clues[2], clues[1], clues[0]],
  ]);

  const options = shuffle([[clues[0], clues[1], clues[2]], permutations[0], permutations[1]]);

  return {
    0: options[0],
    1: options[1],
    2: options[2],
  };
};

/**
 * Builds an array of party game tracks from player answers.
 *
 * Collects answers from all players' party responses and organizes them into game tracks.
 * Handles two types of tracks:
 * - "Who Said This" tracks for 'fact' answers, matching them with player IDs
 * - Multiple choice tracks for other answer types, shuffling and deduplicating options
 *
 * @param players - The collection of players with their party answers
 * @param language - The language used for generating question text
 * @returns An array of Track objects ready for party game play, with shuffled options and no duplicate answers (case and accent-insensitive)
 */
const buildPartyOptions = (players: Players, language: Language) => {
  const options: Record<string, string[]> = {};
  const whoOptions: { text: string; playerId: string }[] = [];
  const listOfPlayers = getListOfPlayers(players);

  listOfPlayers.forEach((player) => {
    Object.entries<string>(player.data.partyAnswers).forEach(([key, answer]) => {
      if (key !== 'fact') {
        if (options[key] === undefined) {
          options[key] = [];
        }
        if (!options[key].some((a) => stringRemoveAccents(a) === stringRemoveAccents(answer))) {
          options[key].push(answer);
        }
      } else {
        whoOptions.push({
          text: answer,
          playerId: player.id,
        });
      }
    });
  });

  const tracks: Track[] = [];

  whoOptions.forEach((option) => {
    tracks.push({
      game: PARTY_GAMES_NAMES[PARTY_GAMES.WHO_SAID_THIS],
      variant: 'fact',
      data: {
        card: {
          id: option.playerId,
          text: option.text,
          options: uniq(
            shuffle([
              option.playerId,
              ...sampleSize(getListOfPlayersIds(players, false, [option.playerId]), 2),
            ]),
          ),
        },
      },
    });
  });

  Object.entries(options).forEach(([variant, values]) => {
    const trackCandidate = PARTY_TRACKS.find((t) => t.variant === variant);

    if (trackCandidate && values.length > 1) {
      tracks.push({
        game: PARTY_GAMES_NAMES[trackCandidate.game],
        variant,
        data: {
          card: {
            question: getQuestion(variant, language),
            options: shuffle(values),
          },
        },
      });
    }
  });

  return tracks;
};

export const getQuestion = (variant: string, language: Language) => {
  return (
    {
      object: {
        en: 'Which of these objects is the most useful?',
        pt: 'Qual desses objetos é o mais útil?',
      },
      'good-food': {
        en: 'Best food?',
        pt: 'Melhor comida?',
      },
      'bad-food': {
        en: 'Best food?',
        pt: 'Melhor comida?',
      },
      sport: {
        pt: 'Qual desses é o melhor esporte?',
        en: 'Which of these is the best sport?',
      },
      skill: {
        pt: 'Qual dessas é a melhor habilidade?',
        en: 'Which of these is the best skill?',
      },
      hobby: {
        pt: 'Qual desses é o melhor hobby?',
        en: 'Which of these is the best hobby?',
      },
    }?.[variant]?.[language] ??
    {
      en: 'Which of these is the best?',
      pt: 'Qual desses é o melhor?',
    }[language]
  );
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
    [[], [], []],
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
    ...sampleSize(horrorDeck, 3),
    ...sampleSize(lowCandy, 1),
    ...sampleSize(decks.jackpotDeck, 1),
  ]);
  // 2) 2 monsters, 2 low card, 1 medium cards
  scenarios.push([...sampleSize(horrorDeck, 2), ...sampleSize(lowCandy, 2), ...sampleSize(mediumCandy, 1)]);
  // 3) 3 monsters, 2 medium cards
  scenarios.push([...sampleSize(horrorDeck, 3), ...sampleSize(mediumCandy, 2)]);
  // 4) 1 monster, 4 low cards
  scenarios.push([...sampleSize(horrorDeck, 1), ...sampleSize(lowCandy, 4)]);
  // 5) 2 monsters, 1 low, 2 high
  scenarios.push([...sampleSize(horrorDeck, 2), ...sampleSize(lowCandy, 1), ...sampleSize(highCandy, 2)]);

  return {
    scenarios: shuffle(scenarios),
    home: [sample(decks.horrorDeck), ...sampleSize([...decks.candyDeck, sample(decks.jackpotDeck)], 2)],
    costumes: sampleSize(makeArray(AVATAR_SPRITE_LIBRARIES.COSTUMES), playerCount),
    kids: sampleSize(makeArray(AVATAR_SPRITE_LIBRARIES.COSTUMES), 5),
  };
};

export const getMovieReviews = (reviews: MovieReviewCardData[]) => {
  const [good, bad] = reviews.reduce(
    (acc: [MovieReviewCardData[], MovieReviewCardData[]], entry) => {
      acc[entry.type === 'good' ? 0 : 1].push(entry);

      return acc;
    },
    [[], []],
  );

  return {
    good: sample(good),
    bad: sample(bad),
  };
};

export const calculateAllAchievements = (players: Players, store: FirebaseStoreData) => {
  getListOfPlayers(players).forEach((player) => {
    if (player)
      player.team.forEach((team: string, index: number) => {
        // Longest VIP streak
        pushAchievement(store.achievements, player.id, 'longestVIP', team);
        // Longest GA streak
        pushAchievement(store.achievements, player.id, 'longestLoser', team);

        if (index > 0 && team) {
          if (player.team[index - 1] && team !== player.team[index - 1]) {
            increaseAchievement(store.achievements, player.id, 'switchedTeam', 1);
          }
          if (player.team[index - 1] && team === SIDES.WINNER && player.team[index - 1] === SIDES.LOSER) {
            increaseAchievement(store.achievements, player.id, 'joinedVIP', 1);
          }
          if (player.team[index - 1] && team === SIDES.LOSER && player.team[index - 1] === SIDES.WINNER) {
            increaseAchievement(store.achievements, player.id, 'leftVIP', 1);
          }
        }
      });
  });
};
