// Constants
import { DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';

// Utils
import * as utils from '../../utils';
// Internal
import { calculateNewScores, countImpostorVotes, determinePhaseOrder } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerIds, playerCount } = utils.helpers.buildGameOrder(
    players,
    DOUBLE_ROUNDS_THRESHOLD
  );

  // Assigned cards to players depending on player count
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  const cardsPerPlayer = gameOrder.length * 2 + HAND_LIMIT;
  const minimumNumberOfCards = playerCount * cardsPerPlayer;
  const cards = await utils.imageCards.getImageCards(minimumNumberOfCards);

  // Split cards equally between players
  players = utils.game.dealList(cards, players, cardsPerPlayer, 'deck');

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
        round: {
          current: 0,
          total: gameOrder.length,
        },
        turnOrder: playerIds,
      },
      players,
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
        round: utils.helpers.increaseRound(state.round),
        leaderId,
        impostorId,
      },
      players,
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
      players: newPlayers,
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.VOTING,
        phaseOrder: utils.firebase.deleteValue(),
        phaseIndex: utils.firebase.deleteValue(),
        currentPlayerId: utils.firebase.deleteValue(),
      },
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

  // -- Ranking Stuff Start
  // Format <playerId>: [<old score>, <addition points>, <new score>]
  const newScores = calculateNewScores(players, impostorVotes, state.impostorId, state.leaderId);

  const ranking = Object.entries(newScores)
    .map(([playerId, scores]) => {
      return {
        playerId,
        name: players[playerId].name,
        previousScore: scores[0],
        gainedPoints: scores[1],
        newScore: scores[2],
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  // Save
  return {
    update: {
      players,
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.REVEAL,
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

  return {
    set: {
      players,
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.GAME_OVER,
        winners,
        gameEndedAt: Date.now(),
        round: state.round,
      },
    },
  };
};
