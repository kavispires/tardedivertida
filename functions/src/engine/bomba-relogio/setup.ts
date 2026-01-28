// Constants
import { BOMBA_RELOGIO_PHASES, CARD_TYPES, DATA_COUNTS, OUTCOME, ROLES, TOTAL_ROUNDS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { DataCounts, FirebaseStateData, FirebaseStoreData, Status, TimeBombCard } from './types';
// Utils
import utils from '../../utils';
// Internal
import { sample, shuffle, sortBy } from 'lodash';

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
  const achievements = utils.achievements.setup(players, {});

  const playerCount = utils.players.getPlayerCount(players);
  const dataCounts = DATA_COUNTS[playerCount] || DATA_COUNTS[4];

  // Create roles array
  const deck: TimeBombCard[] = shuffle([
    ...utils.game.makeArray(dataCounts.bomb).map(() => ({
      id: 'card-0',
      type: CARD_TYPES.BOMB,
    })),
    ...utils.game.makeArray(dataCounts.wires).map((v) => ({
      id: `card-${v + dataCounts.bomb}`,
      type: CARD_TYPES.WIRE,
    })),
    ...utils.game.makeArray(dataCounts.blank).map((v) => ({
      id: `card-${v + dataCounts.bomb + dataCounts.wires}`,
      type: CARD_TYPES.BLANK,
    })),
  ]);

  const activePlayerId = sample(utils.players.getListOfPlayers(players))?.id;

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
        status: {
          cut: [],
          revealed: 0,
          outcome: OUTCOME.START,
          updatedAt: Date.now(),
          activePlayerIds: { 0: activePlayerId },
        },
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

  const status: Status = state.status;
  const dataCounts: DataCounts = state.dataCounts;
  const listOfPlayers = utils.players.getListOfPlayers(players);

  // ASSIGN ROLES IF STARTING NEW GAME
  if (status.outcome === OUTCOME.START) {
    // Create roles array
    const allRoles = shuffle([
      ...utils.game.makeArray(dataCounts.agents).map(() => ROLES.AGENT),
      ...utils.game.makeArray(dataCounts.terrorists).map(() => ROLES.TERRORIST),
    ]);

    // Assign roles to players
    listOfPlayers.forEach((player, index) => {
      player.role = allRoles[index];
    });
  }

  const playerCount = utils.players.getPlayerCount(players);

  // USE PLAYERS HANDS AS DECK IF NOT STARTING A NEW GAME
  const deck: TimeBombCard[] =
    status.outcome === OUTCOME.START
      ? shuffle(store.deck)
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
  }

  // Update revealed count
  status.revealed += Object.values(status.cut).at(-1)?.type === CARD_TYPES.WIRE ? 1 : 0;

  // OUTCOME CHANGE: IF THE BOMB WAS CUT
  if (Object.values(status.cut).find((card) => card.type === CARD_TYPES.BOMB)) {
    // Do achievements and shit

    // Update state
    status.outcome = OUTCOME.BOMB;
    // TODO: Achievements

    // Call game over phase
    return await prepareGameOverPhase(gameId, store, state, players);
  }

  // OUTCOME CHANGE: IF THE FINAL WIRE WAS CUT
  if (status.revealed >= targetCuts) {
    // Do achievements and shit

    // Update state
    status.outcome = OUTCOME.AGENTS_WIN;
    // TODO: Achievements

    // Call game over phase
    return await prepareGameOverPhase(gameId, store, state, players);
  }

  // IF THE LAST CUT WAS DONE
  if (cutsLength >= targetCuts) {
    // OUTCOME CHANGE: FINAL ROUND TRIGGERS END GAME
    if (round.current === round.total) {
      // Update state
      status.outcome = OUTCOME.TERRORISTS_WIN;
      // TODO: Achievements

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

  // const achievements = getAchievements(store);
  const achievements = [];

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
