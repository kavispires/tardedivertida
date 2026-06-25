// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import { SENSO_LITERARIO_PHASES, TOTAL_ROUNDS } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { buildDeck, buildRanking, buildSequence } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Build deck
  const deck = buildDeck();

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  const round: Round = {
    current: 0,
    total: TOTAL_ROUNDS,
    forceLastRound: false,
  };

  // Save
  return {
    update: {
      store: {
        deck,
        achievements,
        gallery: [],
      },
      state: {
        phase: SENSO_LITERARIO_PHASES.SETUP,
        players,
        round,
      },
    },
  };
};

/**
 * [Pattern Creation Phase] - Players create book title patterns
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePatternCreationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = utils.game.increaseRound(state.round);

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['patternId']);

  // Build sequence
  const sequence = buildSequence(store.deck, round.current);

  // Save
  return {
    update: {
      state: {
        phase: SENSO_LITERARIO_PHASES.PATTERN_CREATION,
        players,
        round,
        sequence,
      },
      stateCleanup: ['gallery', 'ranking'],
    },
  };
};

/**
 * [Result Phase] - Calculate pattern matches and update scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const { gallery, ranking } = buildRanking(store, players, state.sequence);

  // Save
  return {
    update: {
      store: {
        gallery: [...(store.gallery || []), gallery],
        achievements: store.achievements,
      },
      state: {
        phase: SENSO_LITERARIO_PHASES.RESULT,
        players,
        gallery,
        ranking,
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
  const winners = utils.players.determineWinners(players);

  await markGameAsComplete(gameId);

  const achievements = calculateAchievements(store.achievements);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.SENSO_LITERARIO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  // Save
  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: SENSO_LITERARIO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery: store.gallery,
      },
    },
  };
};
