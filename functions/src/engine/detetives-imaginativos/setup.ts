// Constants
import { DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT, TOTAL_ROUNDS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, TableEntry } from './types';
// Utils
import utils from '../../utils';
// Internal
import { calculateRanking, countImpostorVotes, getAchievements } from './helpers';
import { saveData } from './data';
import { cloneDeep } from 'lodash';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  data: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = utils.players.buildGameOrder(players);

  // Assigned cards to players depending on player count
  const cardsPerPlayer = TOTAL_ROUNDS * 2 + HAND_LIMIT;

  // Split cards equally between players
  utils.playerHand.dealDeck(players, data.cards, cardsPerPlayer, 'deck');

  const achievements = utils.achievements.setup(players, store, {
    leader: 0,
    impostor: 0,
    defenseTime: 0,
    receivedVotes: 0,
    votedImpostor: 0,
    votedInnocent: 0,
    clueLength: 0,
  });

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
        impostorId: utils.game.getRandomItem(gameOrder),
        turnOrder: gameOrder,
      },
    },
  };
};

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
  const impostorId = utils.game.getRandomItem(utils.players.getListOfPlayersIds(players, false, [leaderId]));

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
        turnOrder: utils.players.reorderGameOrder(state.turnOrder, leaderId),
      },
      stateCleanup: ['phaseOrder', 'phaseIndex', 'currentPlayerId', 'impostorVotes', 'ranking', 'table'],
    },
  };
};

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

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Check how many votes impostor got
  const impostorVotes = countImpostorVotes(players, state.impostorId, store);

  const ranking = calculateRanking(players, impostorVotes, state.impostorId, state.leaderId);

  // Achievements
  utils.achievements.increase(store, state.leaderId, 'leader', 1);
  utils.achievements.increase(store, state.impostorId, 'impostor', 1);
  utils.achievements.increase(store, state.leaderId, 'clueLength', state.clue.length || 0);

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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);
  const gallery = cloneDeep(store.usedCards);

  await utils.firestore.markGameAsComplete(gameId);

  const achievements = getAchievements(store);

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
