// Constants
import {
  CORREIO_DO_AMOR_PHASES,
  DECK_INFO_BY_PLAYER_COUNT,
  MAX_ROUNDS,
  OUTCOME,
  PLAYER_STATUS,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FestaJuninaCard, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { setupAchievements, calculateAchievements } from './achievements';
import { buildRoundDeck } from './helpers';
import { cleanupStore, markGameAsComplete } from '../../services/game-session';

/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param data - The game resources data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  const { gameOrder } = utils.turnOrder.create(players);

  return {
    update: {
      store: {
        achievements,
        plusRotation: resourceData.plusRotation,
        advancedRotation: resourceData.advancedRotation,
      },
      state: {
        phase: CORREIO_DO_AMOR_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
          forceLastRound: false,
        },
        gameOrder, // Fixed game order for the entire game and used every round
        startingPlayerId: gameOrder.at(-1),
        outcome: OUTCOME.SETUP,
        cardsDict: resourceData.cardsDict,
      },
    },
  };
};

/**
 * Prepare Card play phase where a player draws and plays a card
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const cardsDict: Dictionary<FestaJuninaCard> = state.cardsDict;

  // NEW ROUND
  if (state.outcome === OUTCOME.SETUP) {
    // Generate deck
    const deck = buildRoundDeck(
      cardsDict,
      state.round.current,
      utils.players.getPlayerCount(players),
      store.plusRotation,
      store.advancedRotation,
    );

    // Deal cards to players
    utils.players.getListOfPlayers(players).forEach((player) => {
      player.hand = [deck.pop()];
      player.keywords = [];
      player.status = PLAYER_STATUS.ACTIVE;
    });

    // Increase round
    const round = utils.game.increaseRound(state.round);

    // Determine the starting player for the round, and active player
    const startingPlayerId = utils.turnOrder.getNextPlayerId(state.gameOrder, state.startingPlayerId);
    const activePlayerId = startingPlayerId;
    const turnOrder = utils.turnOrder.reorder([...state.gameOrder], startingPlayerId);

    // Set cards aside depending on player count
    const playerCount = utils.players.getPlayerCount(players);
    const cardsSetAside: UID[] = [];
    const cardsSetAsideCount = DECK_INFO_BY_PLAYER_COUNT[playerCount].setAsideCards;
    for (let i = 0; i < cardsSetAsideCount; i++) {
      const cardId = deck.pop();
      if (cardId) {
        cardsSetAside.push(cardId);
      }
    }

    // Update outcome
    // TODO

    // Ready players
    utils.players.readyPlayers(players, activePlayerId);

    // Prepare turn: card to be drawn
    const turnUpdate = {
      outcome: OUTCOME.CONTINUE,
      nextDrawnCardId: deck.pop() ?? null,
      activeCardId: null,
      activeEffectKeyword: null,
      targetPlayersIds: [],
    };

    return {
      update: {
        store: {
          previousDeck: deck,
        },
        state: {
          phase: CORREIO_DO_AMOR_PHASES.CARD_PLAY,
          key: String(Date.now()), // Use to force re-render in the client
          players,
          round,
          cardsDict,
          activePlayerId,
          turnOrder,
          cardsSetAside,
          deck,
          discardPile: [],
          ...turnUpdate,
        },
        stateCleanup: [
          /* TODO: List properties to clean up from previous phase */
        ],
      },
    };
  }

  // NEXT TURN
  const activePlayerId = utils.turnOrder.getNextPlayerId(state.turnOrder, state.activePlayerId);

  // Ready players
  utils.players.readyPlayers(players, activePlayerId);

  // Handle achievements
  // TODO: Handle achievements if needed

  return {
    update: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_PLAY,
        key: String(Date.now()), // Use to force re-render in the client
        players,
        activePlayerId,
      },
      stateCleanup: [
        /* TODO: List properties to clean up from previous phase */
      ],
    },
  };
};

/**
 * CardEffects phase - TODO: describe phase purpose
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardEffectsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  return {
    update: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_EFFECTS,
        players,
        // TODO: Add phase-specific state
      },
      stateCleanup: [
        /* TODO: List properties to clean up from previous phase */
      ],
    },
  };
};

/**
 * CardResolution phase - TODO: describe phase purpose
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardResolutionPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  return {
    update: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_RESOLUTION,
        players,
        // TODO: Add phase-specific state
      },
      stateCleanup: [
        /* TODO: List properties to clean up from previous phase */
      ],
    },
  };
};

/**
 * Game Over phase - calculates final scores and achievements
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
  // Determine winners
  const winners = utils.players.determineWinners(players);

  // Calculate achievements
  const achievements = calculateAchievements(store.achievements);

  // Mark game meta as complete
  await markGameAsComplete(gameId);

  // Save game to each user's profile
  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  // await saveData(store.language, store.pastStuff);

  // Cleanup player for game over screen
  utils.players.cleanup(players, []); // add in the array any props you want to keep on the player object

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        achievements,
        winners,
        // TODO: Add game over specific data, like gallery
      },
    },
  };
};
