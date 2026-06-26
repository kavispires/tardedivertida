// Types
import type { FirebaseStateData, FirebaseStoreData, MonsterSketch, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { RETRATO_FALADO_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  getListOfPlayersIds,
  setPlayersReadyState,
  removePropertiesFromPlayers,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { saveData } from './data';
import { buildDeck, buildRanking, gatherSketches } from './helpers';

// Helpers1

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
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerCount } = turnOrderUtils.create(players);

  // Build deck
  const deck = buildDeck(additionalData.allMonsters, playerCount);

  const achievements = setupAchievements(getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        deck,
        pastSketches: [],
        achievements,
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

/**
 * [Composite Sketch Phase] - Witness describes monster, players draw
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCompositeSketchPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const witnessId = state.gameOrder[state.round.current];
  const deck = [...store.deck];
  const currentMonster = deck.pop();

  setPlayersReadyState(players, false, { excludeIds: [witnessId] });
  removePropertiesFromPlayers(players, ['vote', 'drawing']);

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
        round: increaseRound(state.round),
      },
      storeCleanup: ['currentOrientation', 'witnessVote', 'mostVotes', 'ranking', 'mostVoted', 'votes'],
    },
  };
};

/**
 * [Evaluation Phase] - Players vote on the best sketch
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const currentMonster = { ...state.currentMonster };
  if (store.currentOrientation) {
    currentMonster.orientation = store.currentOrientation;
  }

  // Gather all drawings
  const sketches = gatherSketches(players, currentMonster, state.witnessId);

  setPlayersReadyState(players, false);

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

/**
 * [Reveal Phase] - Display voting results and reveal monster
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Create ranking
  const { ranking, mostVotes, witnessVote, mostVoted, votes } = buildRanking(players, state.witnessId, store);

  const selectedSketches = state.sketches.filter(
    (sketch: MonsterSketch) => sketch.playerId && mostVotes.includes(sketch.playerId),
  );

  await saveData(state.sketches, store.language);

  setPlayersReadyState(players, false);

  // Save
  return {
    update: {
      store: {
        pastSketches: [...store.pastSketches, ...selectedSketches],
        achievements: store.achievements,
      },
      state: {
        phase: RETRATO_FALADO_PHASES.REVEAL,
        players,
        witnessVote,
        mostVotes,
        ranking,
        mostVoted,
        votes,
      },
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
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
  const winners = determineWinners(players);

  await markGameAsComplete(gameId);

  const achievements = calculateAchievements(store.achievements);

  await saveGameToUsers({
    gameName: GAME_NAMES.RETRATO_FALADO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.pastSketches;

  cleanupPlayers(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: RETRATO_FALADO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        gallery,
        winners,
        achievements,
      },
    },
  };
};
