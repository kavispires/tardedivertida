// Constants
import { BOMBA_RELOGIO_PHASES, CARD_TYPES, DATA_COUNTS, OUTCOME, ROLES, TOTAL_ROUNDS } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { DataCount, FirebaseStateData, FirebaseStoreData, Status, TimeBombCard } from './types';
// Utils
import utils from '../../utils';
// Internal
import { sample, shuffle } from 'lodash';

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
  const dataCount = DATA_COUNTS[playerCount] || DATA_COUNTS[4];

  // Create roles array
  const deck: TimeBombCard[] = shuffle([
    ...utils.game.makeArray(dataCount.bomb).map(() => ({
      id: 'card-0',
      type: CARD_TYPES.BOMB,
    })),
    ...utils.game.makeArray(dataCount.wires).map((v) => ({
      id: `card-${v + dataCount.bomb}`,
      type: CARD_TYPES.WIRE,
    })),
    ...utils.game.makeArray(dataCount.blank).map((v) => ({
      id: `card-${v + dataCount.bomb + dataCount.wires}`,
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
        dataCount,
        status: {
          cut: [],
          revealed: 0,
          outcome: OUTCOME.START,
          updatedAt: Date.now(),
          activePlayerIds: [activePlayerId ?? 'ERROR'],
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
  const dataCount: DataCount = state.dataCount;
  const listOfPlayers = utils.players.getListOfPlayers(players);

  // ASSIGN ROLES IF STARTING NEW GAME
  if (status.outcome === OUTCOME.START) {
    // Create roles array
    const allRoles = shuffle([
      ...utils.game.makeArray(dataCount.agents).map(() => ROLES.AGENT),
      ...utils.game.makeArray(dataCount.terrorists).map(() => ROLES.TERRORIST),
    ]);

    utils.helpers.print(allRoles);

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
  status.cut = [];
  status.activePlayerIds = [status.activePlayerIds[0]];

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
  // Unready players
  utils.players.unReadyPlayers(players);

  const round: Round = state.round;

  const dataCount: DataCount = state.dataCount;
  const targetCuts = dataCount.wires;

  const status: Status = state.status;
  status.updatedAt = Date.now();

  const targetPlayerId =
    status.activePlayerIds.length > 1 ? status.activePlayerIds[status.activePlayerIds.length - 1] : null;
  const activePlayerId =
    status.activePlayerIds.length > 1
      ? status.activePlayerIds[status.activePlayerIds.length - 2]
      : status.activePlayerIds[0];

  utils.helpers.print({ 'Target Player ID': targetPlayerId });
  utils.helpers.print({ 'Active Player ID': activePlayerId });

  // Remove the card from the player
  if (status.cut.length > 0) {
    const latestCut = status.cut[status.cut.length - 1];
    players[latestCut.id].hand = players[latestCut.id].hand.filter(
      (card: TimeBombCard) => card.id !== latestCut.id,
    );
  }

  // Update revealed count
  status.revealed = status.cut.filter((card) => card.type === CARD_TYPES.WIRE).length;

  // IF THE BOMB WAS CUT
  if (status.cut.find((card) => card.type === CARD_TYPES.BOMB)) {
    // Do achievements and shit

    // Update state
    status.outcome = OUTCOME.BOMB;
    // TODO: Achievements

    // Call game over phase
    return await prepareGameOverPhase(gameId, store, state, players);
  }

  // IF THE FINAL WIRE WAS CUT
  if (status.revealed >= targetCuts) {
    // Do achievements and shit

    // Update state
    status.outcome = OUTCOME.AGENTS_WIN;
    // TODO: Achievements

    // Call game over phase
    return await prepareGameOverPhase(gameId, store, state, players);
  }

  // IF THE LAST CUT WAS DONE
  if (status.cut.length >= targetCuts) {
    // FINAL ROUND TRIGGERS END GAME
    if (round.current === round.total) {
      // Update state
      status.outcome = OUTCOME.TERRORISTS_WIN;
      // TODO: Achievements

      return await prepareGameOverPhase(gameId, store, state, players);
    }

    // IF NOT FINAL ROUND, DECLARATION
    status.outcome = OUTCOME.END;
    // TODO: Achievements
  }

  // // If someone has cut, do this
  // if (status.cut.length > 0) {

  // }

  // IF nobody has cut, continue
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
  const winners = utils.players.determineWinners(players);

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

  utils.players.cleanup(players, []);

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
      },
    },
  };
};
