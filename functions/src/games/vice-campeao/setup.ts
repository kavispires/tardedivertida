import { keyBy, shuffle } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, RunActivity, RunnerCard } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { DEFAULT_HAND_SIZE, MAX_ROUNDS, STARTING_CARDS, VICE_CAMPEAO_PHASES } from './constants';
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
import { setupAchievements, calculateAchievements } from './achievements';
import { TRIGGER_KEYS } from './data';
import { buildRun, getCardIdentifierKey } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(getListOfPlayersIds(players));

  const { gameOrder: turnOrder } = turnOrderUtils.create(players);

  // Add starting position
  addPropertiesToPlayers(players, { positions: [0], hand: [] });

  const cardsDict = keyBy(additionalData.cards, 'id');

  let deck = shuffle(Object.keys(cardsDict));

  // Give starting cards to each player (but only non-repeated movement cards)
  getListOfPlayers(players).forEach((player) => {
    const valuesUsed: number[] = [];
    const hand: string[] = [];
    let deckIndex = 0;
    while (hand.length < STARTING_CARDS) {
      // Get a random card
      const cardId = deck[deckIndex];
      if (!cardId) {
        throw new Error('Deck is empty');
      }
      const card = cardsDict[cardId];
      // Check if the card is a movement and if the card value has already been used
      if (card.type.startsWith('movement') && !valuesUsed.includes(card.value ?? 0)) {
        valuesUsed.push(card.value ?? 0);
        hand.push(cardId);
      }
      deckIndex++;
    }
    player.hand = hand;
    deck = deck.filter((id) => !hand.includes(id));
  });

  // Save
  return {
    update: {
      store: {
        deck,
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

  const cardsDict: Dictionary<RunnerCard> = state.cardsDict;

  // Discard any previously used card
  if (state.round.current > 0) {
    getListOfPlayers(players).forEach((player) => {
      player.hand = player.hand.filter((cardId) => cardId !== player.selectedCardId);
    });
    removePropertiesFromPlayers(players, ['selectedCardId', 'selectedTargetId']);
  }

  // Deal new card to player (it must be unique in the player's hand if possible)
  let deck = [...store.deck];

  getListOfPlayers(players).forEach((player) => {
    const hand: string[] = player.hand;
    const usedIdentifiers: string[] = player.hand.map((cardId) => getCardIdentifierKey(cardsDict[cardId]));
    let deckIndex = 0;
    while (hand.length < DEFAULT_HAND_SIZE) {
      if (deckIndex >= deck.length) {
        const whateverDeck = deck.filter((id) => !hand.includes(id));
        if (whateverDeck.length === 0) {
          throw new Error('Deck is empty');
        }
        const pick = whateverDeck[0];
        hand.push(pick);
        continue; // Skip to the next iteration of the while loop
      }

      // Get a random card
      const cardId = deck[deckIndex];
      if (!cardId) {
        throw new Error('Deck is empty');
      }
      const card = cardsDict[cardId];
      // Check if the card is a movement and if the card value has already been used
      const identifier = getCardIdentifierKey(card);
      if (!usedIdentifiers.includes(identifier)) {
        usedIdentifiers.push(identifier);
        hand.push(cardId);
      }
      deckIndex++;
    }
    player.hand = hand;
    deck = deck.filter((id) => !hand.includes(id));
  });

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
        deck,
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
