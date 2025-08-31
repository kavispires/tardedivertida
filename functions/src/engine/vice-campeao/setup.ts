// Constants
import { CARD_PER_ROUND, MAX_ROUNDS, STARTING_CARDS, VICE_CAMPEAO_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, RunActivity } from './types';
// Utils
import utils from '../../utils';
import { keyBy } from 'lodash';
import { GAME_NAMES } from '../../utils/constants';
import { buildRun, getAchievements } from './helpers';

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
  const achievements = utils.achievements.setup(players, {
    first: 0,
    second: 0,
    third: 0,
    last: 0,
    secondToLast: 0,
    noMovement: 0,
    selfCards: 0,
    distance: 0,
  });

  const { gameOrder: turnOrder } = utils.players.buildGameOrder(players);

  const cardsDict = keyBy(additionalData.cards, 'id');

  // Build deck and give two cards for each player
  utils.deck.setup(store, players, Object.keys(cardsDict), STARTING_CARDS + CARD_PER_ROUND * MAX_ROUNDS);
  utils.deck.deal(store, players, STARTING_CARDS);

  // Add starting position
  utils.players.addPropertiesToPlayers(players, { positions: [0] });

  // Save
  return {
    update: {
      store: {
        ...store,
        achievements,
        replay: [],
      },
      state: {
        phase: VICE_CAMPEAO_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        turnOrder,
        cardsDict,
      },
    },
  };
};

export const prepareCardSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);
  // Discard any previously used card
  if (state.round.current > 0) {
    utils.players.getListOfPlayers(players).forEach((player) => {
      utils.deck.discard(store, players, player.id, player.selectedCardId);
    });
    utils.players.removePropertiesFromPlayers(players, ['selectedCardId', 'selectedTargetId']);
  }

  utils.deck.deal(store, players, CARD_PER_ROUND);

  const turnOrder = utils.players.reorderGameOrder(state.turnOrder, state.turnOrder[1]);

  const currentPositions = utils.players
    .getListOfPlayers(players)
    .reduce((acc: Record<PlayerId, number>, { id, positions }) => {
      acc[id] = positions.at(-1) || 0;
      return acc;
    }, {});

  const race: RunActivity[] = [
    {
      id: 0,
      cardId: '',
      playerId: '',
      targetId: '',
      startingPositions: currentPositions,
      endingPositions: currentPositions,
    },
  ];

  // Save
  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: VICE_CAMPEAO_PHASES.CARD_SELECTION,
        players,
        round: utils.helpers.increaseRound(state.round),
        turnOrder,
        race,
      },
      stateCleanup: ['ranking', 'lockedPlayersIds', 'ongoingPlusOnePlayersIds', 'ongoingMinusOnePlayersIds'],
    },
  };
};

export const prepareRunPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const race = buildRun(players, state.cardsDict, state.turnOrder, store);

  // Update positions
  const finalPositions = race.at(-1)?.endingPositions ?? {};
  Object.keys(finalPositions).map((playerId) => {
    players[playerId].positions.push(finalPositions[playerId]);
  });

  const scores = new utils.players.Scores(players, [0]);
  Object.keys(players).forEach((playerId) => {
    const currentPosition = players[playerId].positions.at(-1) || 0;
    const previousPosition = players[playerId].positions.at(-2) || 0;
    const value = currentPosition - previousPosition;

    scores.add(playerId, value, 0);
  });

  // Get any players that are locked
  const lockedPlayersIds = Object.values(players).reduce((acc: string[], player) => {
    if (state.cardsDict[player.selectedCardId].triggerKey === 'freeze') {
      acc.push(player.selectedTargetId);
    }
    return acc;
  }, []);
  // Players with ongoing +1
  const ongoingPlusOnePlayersIds = Object.values(players).reduce((acc: string[], player) => {
    if (state.cardsDict[player.selectedCardId].triggerKey === 'ongoing-plus-one') {
      acc.push(player.selectedTargetId);
    }
    return acc;
  }, []);
  // Players with ongoing -1
  const ongoingMinusOnePlayersIds = Object.values(players).reduce((acc: string[], player) => {
    if (state.cardsDict[player.selectedCardId].triggerKey === 'ongoing-minus-one') {
      acc.push(player.selectedTargetId);
    }
    return acc;
  }, []);

  return {
    update: {
      store: {
        achievements: store.achievements,
        replay: [...store.replay, ...race.slice(state.round.current === 1 ? 0 : 1)],
      },
      state: {
        phase: VICE_CAMPEAO_PHASES.RUN,
        players,
        race,
        ranking: scores.rank(players),
        lockedPlayersIds,
        ongoingPlusOnePlayersIds,
        ongoingMinusOnePlayersIds,
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
  const ranked = utils.players.orderPlayersByScore(players, true);
  const winners = ranked[1] ?? [];

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.VICE_CAMPEAO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, ['positions']);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: VICE_CAMPEAO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        replay: store.replay,
        cardsDict: state.cardsDict,
        achievements,
      },
    },
  };
};
