// Constants
import { DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT } from './constants';
// Interfaces
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
import { Players, SaveGamePayload } from '../../utils/interfaces';
// Utils
import * as gameUtils from '../../utils/game-utils';
import * as imageCardsUtils from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
import * as playerHandUtils from '../../utils/player-hand-utils';
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
  const playerIds = gameUtils.shuffle(Object.keys(players));
  const gameOrder = playerIds.length < 6 ? [...playerIds, ...playerIds] : playerIds;

  // Assigned cards to players depending on player count
  // We build the used cards deck all at once to avoid having to generate and
  // get unique ones every time
  const cardsPerPlayer = gameOrder.length * 2 + HAND_LIMIT;
  const minimumNumberOfCards = playerIds.length * cardsPerPlayer;
  const cards = await imageCardsUtils.getImageCards(minimumNumberOfCards);

  // Split cards equally between players
  players = gameUtils.dealList(cards, players, cardsPerPlayer, 'deck');

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
  players = playerHandUtils.dealPlayersCard(players, HAND_LIMIT);
  players = utils.removePropertiesFromPlayers(players, ['vote']);

  // Determine the leader
  const leaderId = store.gameOrder[state.round.current];
  // Determine the impostor
  const impostorId = gameUtils.shuffle(Object.keys(players).filter((playerId) => playerId !== leaderId))[0];

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE,
        round: utils.increaseRound(state.round),
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
  const newPlayers = utils.unReadyPlayers(players, state.leaderId);

  // Save
  return {
    update: {
      players: newPlayers,
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.VOTING,
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
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.determineWinners(players);

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
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
