// Types
import type { FirebaseStateData, FirebaseStoreData, MonsterSketch, ResourceData } from './types';
// Constants
import { RETRATO_FALADO_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Helpers1
import utils from '../../utils';
import { buildDeck, buildRanking, gatherSketches, getAchievements } from './helpers';
import { saveData } from './data';

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
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerCount } = utils.players.buildGameOrder(players);

  // Build deck
  const deck = buildDeck(additionalData.allMonsters, playerCount);

  const achievements = utils.achievements.setup(players, store, {
    votes: 0,
    groupVote: 0,
    witnessPick: 0,
  });

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

export const prepareCompositeSketchPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
      storeCleanup: ['currentOrientation', 'witnessVote', 'mostVotes', 'ranking', 'mostVoted', 'votes'],
    },
  };
};

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
  players: Players,
): Promise<SaveGamePayload> => {
  // Create ranking
  const { ranking, mostVotes, witnessVote, mostVoted, votes } = buildRanking(players, state.witnessId, store);

  const selectedSketches = state.sketches.filter(
    (sketch: MonsterSketch) => sketch.playerId && mostVotes.includes(sketch.playerId),
  );

  await saveData(state.sketches, store.language);

  utils.players.unReadyPlayers(players);

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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  await utils.firestore.markGameAsComplete(gameId);

  const achievements = getAchievements(store);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.RETRATO_FALADO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.pastSketches;

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
