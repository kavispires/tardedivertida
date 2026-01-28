// Constants
import { BOMBA_RELOGIO_PHASES, CARD_TYPES, DATA_COUNTS, OUTCOME, ROLES, TOTAL_ROUNDS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { DataCounts, FirebaseStateData, FirebaseStoreData, Status, TimeBombCard } from './types';
// Utils
import utils from '../../utils';
// Internal
import { shuffle, sortBy } from 'lodash';
import {
  buildDeck,
  determineRoles,
  getAchievements,
  getStartingAchievements,
  getStartingStatus,
} from './helpers';

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
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, getStartingAchievements());

  const playerCount = utils.players.getPlayerCount(players);
  const dataCounts = DATA_COUNTS[playerCount] || DATA_COUNTS[4];

  // Create roles array
  const deck = buildDeck(dataCounts);

  // Save
  return {
    update: {
      store: {
        deck,
        achievements,
      },
      state: {
        phase: BOMBA_RELOGIO_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
          forceLastRound: false,
        },
        dataCounts,
        status: getStartingStatus(players),
      },
    },
  };
};

export const prepareDeclarationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const status: Status = state.status.outcome === OUTCOME.RESTART ? getStartingStatus(players) : state.status;
  const dataCounts: DataCounts = state.dataCounts;
  const listOfPlayers = utils.players.getListOfPlayers(players);

  const isNewGame = status.outcome === OUTCOME.START || status.outcome === OUTCOME.RESTART;

  const storeUpdate: Partial<FirebaseStoreData> = {
    achievements: store.achievements,
  };
  if (isNewGame) {
    storeUpdate.achievements = utils.achievements.setup(players, getStartingAchievements());
    storeUpdate.deck = buildDeck(dataCounts);
  }

  // ASSIGN ROLES IF STARTING NEW GAME
  if (isNewGame) {
    determineRoles(players, dataCounts, storeUpdate);
  }

  const playerCount = utils.players.getPlayerCount(players);

  // USE PLAYERS HANDS AS DECK IF NOT STARTING A NEW GAME
  const deck: TimeBombCard[] = isNewGame
    ? shuffle(storeUpdate.deck)
    : shuffle(listOfPlayers.flatMap((player) => player.hand));
  const deckChunks = utils.game.sliceInParts(deck, playerCount);

  // Assign roles to players
  listOfPlayers.forEach((player, index) => {
    player.hand = deckChunks[index];
  });

  status.outcome = OUTCOME.CONTINUE;
  status.cut = {};

  const activePlayerIdsArray = sortBy(Object.keys(status.activePlayerIds))
    .map((key) => status.activePlayerIds[key])
    .filter(Boolean);
  status.activePlayerIds = { 0: activePlayerIdsArray.at(-1) ?? null, 1: null };

  // Save
  return {
    update: {
      store: {
        ...storeUpdate,
      },
      state: {
        phase: BOMBA_RELOGIO_PHASES.DECLARATION,
        players,
        round: utils.helpers.increaseRound(state.round),
        status,
      },
    },
  };
};

export const prepareExaminationPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round: Round = state.round;

  const dataCounts: DataCounts = state.dataCounts;
  const targetCuts = dataCounts.wires;
  const status: Status = state.status;

  const cutsLength = Object.keys(status.cut).length;
  const activePlayerIdsLength = Object.keys(status.activePlayerIds).length;

  status.updatedAt = Date.now();

  const activePlayerIdsArray = sortBy(Object.keys(status.activePlayerIds)).map(
    (key) => status.activePlayerIds[key],
  );

  const targetPlayerId = activePlayerIdsArray.at(-1) ?? null;
  const activePlayerId = activePlayerIdsArray.at(-2) ?? null;

  if (!activePlayerId) {
    throw new Error('No active player found for examination phase.');
  }

  // Remove the card from the player
  if (cutsLength > 0 && targetPlayerId) {
    const latestCut = status.cut[cutsLength - 1];
    players[targetPlayerId].hand = players[targetPlayerId].hand.filter(
      (card: TimeBombCard) => card.id !== latestCut.id,
    );
    // Achievements for cutting wires and blanks
    if (latestCut.type === CARD_TYPES.WIRE) {
      utils.achievements.increase(store, activePlayerId, 'wires', 1);
    } else if (latestCut.type === CARD_TYPES.BLANK) {
      utils.achievements.increase(store, activePlayerId, 'blank', 1);
    }
    // Achievement for being picked
    utils.achievements.increase(store, targetPlayerId, 'picked', 1);
  }

  // Update revealed count
  status.revealed += Object.values(status.cut).at(-1)?.type === CARD_TYPES.WIRE ? 1 : 0;

  // OUTCOME CHANGE: IF THE BOMB WAS CUT
  if (Object.values(status.cut).find((card) => card.type === CARD_TYPES.BOMB)) {
    // Do achievements and shit

    // Update state
    status.outcome = OUTCOME.BOMB;

    // Achievement: Determine if it is stupid bomber or best terrorist
    const activePlayer = players[activePlayerId];
    if (activePlayer.role === ROLES.TERRORIST) {
      utils.achievements.increase(store, activePlayerId, 'terroristBomb', 1);
    } else {
      utils.achievements.increase(store, activePlayerId, 'agentBomb', 1);
    }

    // Call game over phase
    return await prepareGameOverPhase(gameId, store, state, players);
  }

  // OUTCOME CHANGE: IF THE FINAL WIRE WAS CUT
  if (status.revealed >= targetCuts) {
    // Do achievements and shit

    // Update state
    status.outcome = OUTCOME.AGENTS_WIN;

    // Call game over phase
    return await prepareGameOverPhase(gameId, store, state, players);
  }

  // IF THE LAST CUT WAS DONE
  if (cutsLength >= targetCuts) {
    // OUTCOME CHANGE: FINAL ROUND TRIGGERS END GAME
    if (round.current === round.total) {
      // Update state
      status.outcome = OUTCOME.TERRORISTS_WIN;

      return await prepareGameOverPhase(gameId, store, state, players);
    }

    // IF NOT FINAL ROUND, DECLARATION
    status.outcome = OUTCOME.END;
  }

  // Update active player
  utils.players.readyPlayers(players, activePlayerId);
  // Update new target player
  if (activePlayerIdsArray.at(-1) !== null) {
    status.activePlayerIds[activePlayerIdsLength] = null;
  }

  // Save
  return {
    update: {
      state: {
        phase: BOMBA_RELOGIO_PHASES.EXAMINATION,
        players,
        status,
        currentTargetPlayerId: utils.firestore.deleteValue(),
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
  let winners = Object.values(players).filter((player) => player.role === ROLES.AGENT);
  const status: Status = state.status;
  if (status.outcome === OUTCOME.TERRORISTS_WIN || status.outcome === OUTCOME.BOMB) {
    winners = Object.values(players).filter((player) => player.role === ROLES.TERRORIST);
  }

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.BOMBA_RELOGIO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, ['role', 'hand', 'declarations']);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: BOMBA_RELOGIO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
        status: state.status,
        dataCounts: state.dataCounts,
      },
    },
  };
};
