// Constants
import { DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, TableEntry } from './types';
// Utils
import utils from '../../utils';
// Internal
import { calculateRanking, countImpostorVotes, determinePhaseOrder } from './helpers';
import { saveData } from './data';
import { cloneDeep } from 'lodash';

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
  data: ResourceData,
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
  players: Players,
): Promise<SaveGamePayload> => {
  // Make sure everybody has 6 cards in hand
  players = utils.playerHand.dealPlayersCard(players, HAND_LIMIT);
  players = utils.players.removePropertiesFromPlayers(players, ['vote']);

  // Determine the leader
  const leaderId = store.gameOrder[state.round.current];
  // Determine the impostor
  const impostorId = utils.game.shuffle(
    utils.players.getListOfPlayersIds(players).filter((playerId) => playerId !== leaderId),
  )[0];

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
  players: Players,
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
  players: Players,
): Promise<SaveGamePayload> => {
  // Build phase order (from leader forward once)
  const phaseOrder = determinePhaseOrder(state.leaderId, store.gameOrder, players);

  // Save leaders cards and clue
  const leaderCards = state.table.find((e: TableEntry) => state.leaderId === e.playerId);

  if (leaderCards) {
    store.usedCards.push({
      cards: leaderCards.cards,
      clue: state.clue,
      playerId: leaderCards.playerId,
      isLeader: true,
    });
  }

  const impostorCards = state.table.find((e: TableEntry) => state.impostorId === e.playerId);
  if (impostorCards) {
    store.usedCards.push({
      cards: impostorCards.cards,
      clue: state.clue,
      playerId: impostorCards.playerId,
      isLeader: false,
    });
  }

  // Save
  return {
    update: {
      store: {
        usedCards: store.usedCards,
      },
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
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);
  const gallery = cloneDeep(store.usedCards);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  // Save data: imageCards and clues
  await saveData(store.usedCards, store.language);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        gallery,
      },
    },
  };
};
