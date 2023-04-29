// Constants
import { DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { calculateRanking, countImpostorVotes, determinePhaseOrder } from './helpers';

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
  data: ResourceData
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerIds } = utils.players.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);

  // Assigned cards to players depending on player count
  const cardsPerPlayer = gameOrder.length * 2 + HAND_LIMIT;

  // Split cards equally between players
  players = utils.game.dealList(data.cards, players, cardsPerPlayer, 'deck');

  // Save
  return {
    update: {
      store: {
        turnOrder: playerIds,
        gameOrder,
        usedCards: [],
      },
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: gameOrder.length,
        },
        turnOrder: playerIds,
      },
    },
  };
};

/**
 *
 * @param store
 * @param state
 * @param players
 * @returns
 */
export const prepareSecretCluePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Make sure everybody has 6 cards in hand
  players = utils.playerHand.dealPlayersCard(players, HAND_LIMIT);
  players = utils.players.removePropertiesFromPlayers(players, ['vote']);

  // Determine the leader
  const leaderId = store.gameOrder[state.round.current];
  // Determine the impostor
  const impostorId = utils.game.shuffle(Object.keys(players).filter((playerId) => playerId !== leaderId))[0];

  utils.players.unReadyPlayer(players, leaderId);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE,
        players,
        round: utils.helpers.increaseRound(state.round),
        leaderId,
        impostorId,
      },
    },
  };
};

export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Build phase order (from leader forward once)
  const phaseOrder = determinePhaseOrder(state.leaderId, store.gameOrder, players, true);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY,
        clue: store.clue,
        phaseOrder,
        phaseIndex: 0,
        currentPlayerId: phaseOrder[0],
        table: [],
      },
    },
  };
};

export const prepareDefensePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Build phase order (from leader forward once)
  const phaseOrder = determinePhaseOrder(state.leaderId, store.gameOrder, players);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.DEFENSE,
        phaseOrder,
        phaseIndex: 0,
        currentPlayerId: phaseOrder[0],
      },
    },
  };
};

export const prepareVotingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  const newPlayers = utils.players.unReadyPlayers(players, state.leaderId);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.VOTING,
        players: newPlayers,
      },
      stateCleanup: ['phaseOrder', 'phaseIndex', 'currentPlayerId'],
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Check how many votes impostor got
  const impostorVotes = countImpostorVotes(players, state.impostorId);

  const ranking = calculateRanking(players, impostorVotes, state.impostorId, state.leaderId);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.REVEAL,
        players,
        ranking,
        impostorVotes,
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
  const winners = utils.players.determineWinners(players);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
  });

  return {
    set: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
