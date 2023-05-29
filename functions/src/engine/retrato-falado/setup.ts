// Types
import type { FirebaseStateData, FirebaseStoreData, MonsterSketch, ResourceData } from './types';
// Constants
import { RETRATO_FALADO_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Helpers1
import utils from '../../utils';
import { buildDeck, buildRanking, gatherSketches, getMostVotes } from './helpers';
import { saveData } from './data';

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
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerCount } = utils.players.buildGameOrder(players);

  // Build deck
  const deck = buildDeck(additionalData.allMonsters, playerCount);

  // Save
  return {
    update: {
      store: {
        deck,
        pastSketches: [],
      },
      state: {
        phase: RETRATO_FALADO_PHASES.SETUP,
        gameOrder,
        round: {
          current: 0,
          total: playerCount,
        },
      },
    },
  };
};

export const prepareCompositeSketchPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const witnessId = state.gameOrder[state.round.current];
  const deck = [...store.deck];
  const currentMonster = deck.pop();

  utils.players.unReadyPlayers(players, witnessId);
  utils.players.removePropertiesFromPlayers(players, ['vote', 'drawing']);

  // Save
  return {
    update: {
      store: {
        deck,
      },
      state: {
        phase: RETRATO_FALADO_PHASES.COMPOSITE_SKETCH,
        players,
        currentMonster,
        witnessId,
        round: utils.helpers.increaseRound(state.round),
      },
      storeCleanup: ['currentOrientation'],
    },
  };
};

export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const currentMonster = { ...state.currentMonster };
  if (store.currentOrientation) {
    currentMonster.orientation = store.currentOrientation;
  }

  // Gather all drawings
  const sketches = gatherSketches(players, currentMonster, state.witnessId);

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: RETRATO_FALADO_PHASES.EVALUATION,
        players,
        sketches,
        currentMonster,
      },
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Calculate mostVotes
  const mostVotes = getMostVotes(players, state.witnessId);
  // Get witness vote
  const witnessVote = players[state.witnessId].vote;
  // Create ranking
  const ranking = buildRanking(players, state.witnessId, mostVotes, witnessVote);

  const selectedSketches = state.sketches.filter(
    (sketch: MonsterSketch) => sketch.playerId && mostVotes.includes(sketch.playerId)
  );

  await saveData(state.sketches, store.language);

  // Save
  return {
    update: {
      store: {
        pastSketches: [...store.pastSketches, ...selectedSketches],
      },
      state: {
        phase: RETRATO_FALADO_PHASES.REVEAL,
        players,
        witnessVote,
        mostVotes,
        ranking,
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
    gameName: GAME_NAMES.RETRATO_FALADO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  const gallery = store.pastSketches;

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: RETRATO_FALADO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        gallery,
        winners,
      },
    },
  };
};
