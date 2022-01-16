// Types
import { Players, SaveGamePayload } from '../../utils/types';
import { FirebaseStateData, FirebaseStoreData, MonsterSketch, RetratoFaladoAdditionalData } from './types';
// Constants
import { RETRATO_FALADO_PHASES } from './constants';
// Helpers1
import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
import { buildDeck, buildRanking, gatherSketches, getMostVotes } from './helpers';

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
  additionalData: RetratoFaladoAdditionalData
): Promise<SaveGamePayload> => {
  // Determine player order
  const gameOrder = gameUtils.shuffle(Object.keys(players));

  const playerCount = Object.keys(players).length;

  // Build deck
  const deck = buildDeck(additionalData.allMonsters, additionalData.usedCardsId, playerCount);

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

  utils.unReadyPlayers(players, witnessId);
  utils.removePropertiesFromPlayers(players, ['vote', 'drawing']);

  // Save
  return {
    update: {
      store: {
        deck,
        currentOrientation: firebaseUtils.deleteValue(),
      },
      state: {
        phase: RETRATO_FALADO_PHASES.COMPOSITE_SKETCH,
        currentMonster,
        witnessId,
        round: utils.increaseRound(state.round),
      },
      players,
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

  utils.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: RETRATO_FALADO_PHASES.EVALUATION,
        sketches,
        currentMonster,
      },
      players,
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

  // Save
  return {
    update: {
      store: {
        pastSketches: [...store.pastSketches, ...selectedSketches],
      },
      state: {
        phase: RETRATO_FALADO_PHASES.REVEAL,
        witnessVote,
        mostVotes,
        ranking,
      },
      players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.determineWinners(players);

  // Build gallery

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: RETRATO_FALADO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        gallery: store.pastSketches,
        winners,
      },
    },
  };
};
