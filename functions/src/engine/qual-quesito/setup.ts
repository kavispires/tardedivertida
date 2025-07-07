// Constants
import { CARDS_PER_PLAYER, OUTCOMES, QUAL_QUESITO_PHASES, TOTAL_ROUNDS } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import { keyBy, shuffle } from 'lodash';
import { buildCardsDictFromPlayersHands } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, store, {
    skipTurn: 0,
    skipPlays: 0,
    plays: [],
    rejected: 0,
    wasRejected: 0,
  });

  const deckDict = keyBy(additionalData.allItems, 'id');

  const deckKeys = utils.playerHand.dealDeck(players, Object.keys(deckDict), CARDS_PER_PLAYER, 'hand');

  const { gameOrder: turnOrder } = utils.players.buildGameOrder(players);

  // Save
  return {
    update: {
      store: {
        deckDict,
        deckKeys,
        achievements,
      },
      state: {
        phase: QUAL_QUESITO_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
        turnOrder,
      },
    },
  };
};

export const prepareCategoryCreationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Cleanup
  utils.players.removePropertiesFromPlayers(players, []);

  const round = utils.helpers.increaseRound(state.round);
  const creatorId = utils.players.getActivePlayer(state.turnOrder, round.current);

  // Unready creator only
  utils.players.readyPlayers(players, creatorId);

  const cardsDict = buildCardsDictFromPlayersHands(players, store.deckDict);

  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.CATEGORY_CREATION,
        players,
        round,
        creatorId,
        cardsDict,
      },
      stateCleanup: ['category', 'outcome'],
    },
  };
};

export const prepareCardPlayPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.CARD_PLAY,
        players,
      },
    },
  };
};

export const prepareVerificationPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Gather all played cards
  const table = shuffle(
    utils.players.getListOfPlayers(players).flatMap((player) => {
      return (player.playedCards || []).map((cardId) => ({
        playerId: player.id,
        cardId,
      }));
    }),
  );

  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.VERIFICATION,
        players,
        table,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // If creator have skipped their turn, they gain a new card
  if (state.skipTurn) {
    players[state.creatorId].hand.push(...utils.game.dealItems(store.deckKeys, 1));

    // Save
    return {
      update: {
        store,
        state: {
          phase: QUAL_QUESITO_PHASES.RESULTS,
          players,
          outcome: OUTCOMES.SKIP,
        },
        stateCleanup: ['skipTurn'],
      },
    };
  }

  // If the creator cards have been rejected

  // Or, from accepted and rejected cards if creator have all their cards rejected, they gain a new card
  // Discard all cards played that were accepted.

  // TODO: Add to gallery
  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.RESULTS,
        players,
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
  // Unready players
  utils.players.unReadyPlayers(players);

  const winners = utils.players.determineWinners(players);

  // const achievements = getAchievements(store);
  const achievements = [];

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.QUAL_QUESITO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  // Save
  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: QUAL_QUESITO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
      },
    },
  };
};
