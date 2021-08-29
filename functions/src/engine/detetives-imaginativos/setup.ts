// Constants
import { CARDS_PER_PLAYER, DETETIVES_IMAGINATIVOS_PHASES, HAND_LIMIT } from './constants';
// Interfaces
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
import { Players, SaveGamePayload } from '../../utils/interfaces';
// Utils
import * as gameUtils from '../../utils/game-utils';
import * as imageCards from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
import * as playerHandUtils from '../../utils/player-hand-utils';
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
  const cardsPerPlayer = CARDS_PER_PLAYER[playerIds.length];
  const minNumCards = playerIds.length * cardsPerPlayer;
  const numDecks = Math.ceil(minNumCards / imageCards.IMAGE_CARDS_PER_DECK);
  const cards = gameUtils.shuffle(imageCards.getImageCards(numDecks));

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
  const leader = store.gameOrder[state.round.current];
  // Determine the impostor
  const impostor = gameUtils.shuffle(Object.keys(players).filter((playerId) => playerId !== leader))[0];

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE,
        updatedAt: Date.now(),
        round: utils.increaseRound(state.round),
        leader,
        impostor,
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
  const phaseOrder = determinePhaseOrder(state.leader, store.gameOrder, players, true);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.CARD_PLAY,
        updatedAt: Date.now(),
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
  const phaseOrder = determinePhaseOrder(state.leader, store.gameOrder, players);

  // Save
  return {
    update: {
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.DEFENSE,
        updatedAt: Date.now(),
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
  const newPlayers = utils.unReadyPlayers(players, state.leader);

  // Save
  return {
    update: {
      players: newPlayers,
      state: {
        phase: DETETIVES_IMAGINATIVOS_PHASES.VOTING,
        updatedAt: Date.now(),
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
  const impostorVotes = countImpostorVotes(players, state.impostor);

  // -- Ranking Stuff Start
  // Format <playerId>: [<old score>, <addition points>, <new score>]
  const newScores = calculateNewScores(players, impostorVotes, state.impostor, state.leader);

  const ranking = Object.entries(newScores)
    .map(([playerId, scores]) => {
      return {
        playerId,
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
        updatedAt: Date.now(),
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
