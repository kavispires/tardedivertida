import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import { MEGAMIX_PHASES, TOTAL_CLUBBERS } from './constants';
import { distributeSeeds, getMostVotes, getRanking, handleSeedingData } from './helpers';
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  utils.players.addPropertiesToPlayers(players, { team: ['L'] });

  // Save
  return {
    update: {
      store: {
        tracks: resourceData.tracks,
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

export const prepareSeedingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Give each player 5 outfits
  const clubbers = utils.game.shuffle(
    Array(TOTAL_CLUBBERS)
      .fill(0)
      .map((e, i) => String(e + i))
  );

  // Prepare seeds
  distributeSeeds(store.tracks, players, clubbers);

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

export const prepareTrackPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  if (state.round.current === 0) {
    // Give each player their outfit
    utils.players.getListOfPlayers(players).forEach((player) => {
      player.clubberId = player.data.clubberId;
    });

    // Handle seeding data
    const tracks = handleSeedingData(store.tracks, players);

    const playerData = utils.players.getListOfPlayers(players).reduce((acc, player) => {
      acc[player.id] = {
        seeds: player.seeds,
        data: player.data,
      };
      return acc;
    }, {});

    utils.players.removePropertiesFromPlayers(players, ['data', 'seeds']);

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
          round: utils.helpers.increaseRound(state.round),
          players,
        },
      },
    };
  }

  utils.players.removePropertiesFromPlayers(players, ['data']);

  // Save
  return {
    update: {
      state: {
        phase: MEGAMIX_PHASES.TRACK,
        track: store.tracks[state.round.current],
        round: utils.helpers.increaseRound(state.round),
        players,
      },
    },
  };
};

export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const scoring = getMostVotes(players, 'value');

  const ranking = getRanking(players, scoring, state.round.current);

  // Save
  return {
    update: {
      state: {
        phase: MEGAMIX_PHASES.RESULT,
        ...scoring,
        ranking: ranking.filter((rankEntry) => players[rankEntry.playerId].team[state.round.current] === 'W'),
        players,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winningPlayers = utils.players
    .getListOfPlayers(players)
    .filter((player) => state.winningTeam.includes(player.id));

  const winners = utils.players.determineWinners(utils.helpers.buildObjectFromList(winningPlayers));
  const fairWinners = utils.players.determineWinners(players);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.MEGAMIX,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  utils.players.cleanup(players, ['clubberId']);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, ['tracks']),
    },
    set: {
      state: {
        phase: MEGAMIX_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        fairWinners,
      },
    },
  };
};
