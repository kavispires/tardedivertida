import { keyBy } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, RunActivity } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { CARD_PER_ROUND, MAX_ROUNDS, STARTING_CARDS, VICE_CAMPEAO_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  getListOfPlayers,
  getListOfPlayersIds,
  setPlayersReadyState,
  addPropertiesToPlayers,
  removePropertiesFromPlayers,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { orderPlayersByScore, Scores } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Internal
import utils from '../../legacy-utils';
import { setupAchievements, calculateAchievements } from './achievements';
import { TRIGGER_KEYS } from './data';
import { buildRun } from './helpers';

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
  const achievements = setupAchievements(getListOfPlayersIds(players));

  const { gameOrder: turnOrder } = turnOrderUtils.create(players);

  const cardsDict = keyBy(additionalData.cards, 'id');

  // Build deck and give two cards for each player
  utils.deck.setup(store, players, Object.keys(cardsDict), STARTING_CARDS + CARD_PER_ROUND * MAX_ROUNDS);

  // TODO: Adapt so in the first round it only deals movement cards
  utils.deck.deal(store, players, STARTING_CARDS);

  // Add starting position
  addPropertiesToPlayers(players, { positions: [0] });

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

/**
 * [Card Selection Phase] - Players select betting cards
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false);
  // Discard any previously used card
  if (state.round.current > 0) {
    getListOfPlayers(players).forEach((player) => {
      utils.deck.discard(store, players, player.id, player.selectedCardId);
    });
    removePropertiesFromPlayers(players, ['selectedCardId', 'selectedTargetId']);
  }

  // TODO: Adapt dealing so players get a unique card they don't already have
  utils.deck.deal(store, players, CARD_PER_ROUND);

  const turnOrder = turnOrderUtils.reorder(state.turnOrder, state.turnOrder[1]);

  const currentPositions = getListOfPlayers(players).reduce((acc: Record<UID, number>, { id, positions }) => {
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
        round: increaseRound(state.round),
        turnOrder,
        race,
      },
      stateCleanup: ['ranking', 'lockedPlayersIds', 'ongoingPlusOnePlayersIds', 'ongoingMinusOnePlayersIds'],
    },
  };
};

/**
 * [Run Phase] - Simulate the race with player bets
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRunPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false);

  const race = buildRun(players, state.cardsDict, state.turnOrder, store);

  // Update positions
  const finalPositions = race.at(-1)?.endingPositions ?? {};
  Object.keys(finalPositions).forEach((playerId) => {
    players[playerId].positions.push(finalPositions[playerId]);
  });

  const scores = new Scores(players, [0]);
  Object.keys(players).forEach((playerId) => {
    const currentPosition = players[playerId].positions.at(-1) || 0;
    const previousPosition = players[playerId].positions.at(-2) || 0;
    const value = currentPosition - previousPosition;

    scores.add(playerId, value, 0);
  });

  // Get any players that are locked
  const lockedPlayersIds = Object.values(players).reduce((acc: string[], player) => {
    if (state.cardsDict[player.selectedCardId].triggerKey === TRIGGER_KEYS.FREEZE) {
      acc.push(player.selectedTargetId);
    }
    return acc;
  }, []);
  // Players with ongoing +1
  const ongoingPlusOnePlayersIds = Object.values(players).reduce((acc: string[], player) => {
    if (state.cardsDict[player.selectedCardId].triggerKey === TRIGGER_KEYS.ONGOING_PLUS_ONE) {
      acc.push(player.selectedTargetId);
    }
    return acc;
  }, []);
  // Players with ongoing -1
  const ongoingMinusOnePlayersIds = Object.values(players).reduce((acc: string[], player) => {
    if (state.cardsDict[player.selectedCardId].triggerKey === TRIGGER_KEYS.ONGOING_MINUS_ONE) {
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
  const ranked = orderPlayersByScore(players, true);
  const winners = ranked[1] ?? [];

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
    gameName: GAME_NAMES.VICE_CAMPEAO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  cleanupPlayers(players, ['positions']);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
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
