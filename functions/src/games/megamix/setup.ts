import { keyBy, shuffle } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { AVATAR_SPRITE_LIBRARIES } from '../../constants/sprites';
import { MEGAMIX_PHASES, SIDES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  getListOfPlayers,
  getListOfPlayersIds,
  setPlayersReadyState,
  addPropertiesToPlayers,
  removePropertiesFromPlayers,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
// Internal
import { setupAchievements, increaseAchievement, calculateAchievements } from './achievements';
import {
  calculateAllAchievements,
  distributeSeeds,
  getMostVotes,
  getRanking,
  handleSeedingData,
} from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  addPropertiesToPlayers(players, { team: [SIDES.LOSER] });

  const achievements = setupAchievements(getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        tracks: resourceData.tracks,
        achievements,
      },
      state: {
        phase: MEGAMIX_PHASES.SETUP,
        round: {
          current: 0,
          total: resourceData.tracks.length,
        },
        players,
      },
    },
  };
};

/**
 * [Seeding Phase] - Players select their music and avatar preferences
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareSeedingPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false);

  // Give each player 5 outfits
  const clubbers = shuffle(
    Array(AVATAR_SPRITE_LIBRARIES.CLUBBERS)
      .fill(0)
      .map((e, i) => String(e + i)),
  );

  // Prepare seeds
  distributeSeeds(store.tracks, players, clubbers, !!store?.options?.partyMode);

  // Save
  return {
    update: {
      store: {
        tracks: store.tracks,
      },
      state: {
        phase: MEGAMIX_PHASES.SEEDING,
        players,
      },
    },
  };
};

/**
 * [Track Phase] - Players vote on the current music track
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareTrackPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false);

  if (state.round.current === 0) {
    // Give each player their outfit
    getListOfPlayers(players).forEach((player) => {
      player.clubberId = player.data.clubberId;
    });

    // Handle seeding data
    const tracks = handleSeedingData(store.tracks, players, !!store?.options?.partyMode, store.language);

    const playerData = getListOfPlayers(players).reduce((acc, player) => {
      acc[player.id] = {
        seeds: player.seeds,
        data: player.data,
      };
      return acc;
    }, {});

    removePropertiesFromPlayers(players, ['data', 'seeds']);

    // Save
    return {
      update: {
        store: {
          tracks,
          playerData,
        },
        state: {
          phase: MEGAMIX_PHASES.TRACK,
          track: tracks[state.round.current],
          round: increaseRound(state.round),
          players,
        },
      },
    };
  }

  removePropertiesFromPlayers(players, ['data']);

  // Save
  return {
    update: {
      state: {
        phase: MEGAMIX_PHASES.TRACK,
        track: store.tracks[state.round.current],
        round: increaseRound(state.round),
        players,
      },
    },
  };
};

/**
 * [Result Phase] - Display voting results and team assignments
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const scoring = getMostVotes(players, 'value');

  const ranking = getRanking(players, scoring, state.round.current);

  if (scoring.losingTeam.length === 1) {
    increaseAchievement(store.achievements, scoring.losingTeam[0], 'solitaryLoser', 1);
  }
  if (scoring.winningTeam.length === 1) {
    increaseAchievement(store.achievements, scoring.winningTeam[0], 'solitaryWinner', 1);
  }

  setPlayersReadyState(players, false);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: MEGAMIX_PHASES.RESULT,
        ...scoring,
        ranking: ranking.filter((rankEntry) => players[rankEntry.playerId].team[state.round.current] === 'W'),
        players,
      },
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winningPlayers = getListOfPlayers(players).filter((player) => state.winningTeam.includes(player.id));

  const winners = determineWinners(keyBy(winningPlayers, 'id'));
  const fairWinners = determineWinners(players);

  calculateAllAchievements(players, store);

  await markGameAsComplete(gameId);

  const achievements = calculateAchievements(store.achievements);

  await saveGameToUsers({
    gameName: GAME_NAMES.MEGAMIX,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  cleanupPlayers(players, ['clubberId']);

  return {
    update: {
      storeCleanup: cleanupStore(store, ['tracks']),
    },
    set: {
      state: {
        phase: MEGAMIX_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        fairWinners,
        achievements,
      },
    },
  };
};
