// Constants
import { DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT, TOTAL_ROUNDS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
import { cloneDeep, sample } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, TableEntry } from './types';
// Utils
import utils from '../../utils';
import { setupAchievements, increaseAchievement, getAchievements } from './achievements';
// Internal
import { calculateRanking, countImpostorVotes } from './helpers';
import { saveData } from './data';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param data - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  data: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = utils.turnOrder.create(players);

  // Assigned cards to players depending on player count
  const cardsPerPlayer = TOTAL_ROUNDS * 2 + HAND_LIMIT;

  // Split cards equally between players
  utils.playerHand.dealDeck(players, data.cards, cardsPerPlayer, 'deck');

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        usedCards: [],
        achievements,
      },
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
        // Just so the 'last impostor' is the new leader
        impostorId: sample(gameOrder),
        turnOrder: gameOrder,
      },
    },
  };
};

/**
 * Secret Clue phase - storyteller provides a secret clue for the scene
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareSecretCluePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Make sure everybody has 6 cards in hand
  utils.playerHand.dealPlayersCard(players, HAND_LIMIT);
  utils.players.removePropertiesFromPlayers(players, ['vote']);

  // Determine the leader
  const leaderId = state.impostorId;
  // Determine the impostor
  const impostorId = sample(utils.players.getListOfPlayersIds(players, false, [leaderId]));

  utils.players.unReadyPlayer(players, leaderId);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE,
        players,
        round: utils.game.increaseRound(state.round),
        leaderId,
        impostorId,
        turnOrder: utils.turnOrder.reorder(state.turnOrder, leaderId),
      },
      stateCleanup: ['phaseOrder', 'phaseIndex', 'currentPlayerId', 'impostorVotes', 'ranking', 'table'],
    },
  };
};

/**
 * Card Play phase - players select cards to support or oppose the storyteller
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardPlayPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const leaderId = state.leaderId;
  const clue = players[leaderId].clue || '';

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY,
        clue,
        phaseOrder: [...state.turnOrder, ...state.turnOrder],
        phaseIndex: 0,
        currentPlayerId: state.turnOrder[0],
        table: [],
      },
    },
  };
};

/**
 * Defense phase - storyteller defends their card choices
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareDefensePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

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
        phaseIndex: 0,
        currentPlayerId: state.turnOrder[0],
      },
      stateCleanup: ['phaseOrder'],
    },
  };
};

/**
 * Voting phase - players vote on which card doesn't match the clue
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareVotingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players, state.leaderId);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.VOTING,
        players,
      },
      stateCleanup: ['phaseIndex', 'currentPlayerId'],
    },
  };
};

/**
 * Reveal phase - reveals the impostor card and calculates scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Check how many votes impostor got
  const impostorVotes = countImpostorVotes(players, state.impostorId, store);

  const ranking = calculateRanking(players, impostorVotes, state.impostorId, state.leaderId);

  // Achievements
  increaseAchievement(store.achievements, state.leaderId, 'artistPoints', 1);
  increaseAchievement(store.achievements, state.impostorId, 'impostorPoints', 1);
  increaseAchievement(store.achievements, state.leaderId, 'clueLength', state.clue.length || 0);

  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.REVEAL,
        players,
        ranking,
        impostorVotes,
      },
    },
  };
};

/**
 * Game Over phase - determines winners and saves game data
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
  const winners = utils.players.determineWinners(players);
  const gallery = cloneDeep(store.usedCards);

  await utils.firestore.markGameAsComplete(gameId);

  const achievements = getAchievements(store.achievements);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.DETETIVES_IMAGINATIVOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
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
        achievements,
      },
    },
  };
};
