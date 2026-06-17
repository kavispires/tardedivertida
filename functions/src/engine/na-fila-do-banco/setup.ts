// functions/src/engine/na-fila-do-banco/setup.ts
import {
  CHARACTER_TYPES,
  CUT_IN_HIERARCHY,
  NA_FILA_DO_BANCO_PHASES,
  ONLINE_TRIGGER_POINTS,
  ONLINE_TRIGGER_POINTS_KID,
  OUTCOME,
  TELLER_EFFECT_TYPE,
  TOTAL_ROUNDS,
} from './constants';
import { keyBy, orderBy, shuffle } from 'lodash';
// Utils
import utils from '../../utils';
import type { ClientCard, FirebaseStateData, FirebaseStoreData, Teller } from './types';
import { buildDeck, buildTellers } from './helpers';
import { getAchievements, increaseAchievement, setupAchievements } from './achievements';
import { GAME_NAMES } from '../../utils/constants';

/**
 * [Setup Phase] - Initialize game, create deck, and setup achievements
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
) => {
  const deck = buildDeck(players);

  const { gameOrder } = utils.turnOrder.create(players);
  const playerCount = utils.players.getPlayerCount(players);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  return {
    update: {
      store: {
        achievements,
        gallery: [],
      },
      state: {
        phase: NA_FILA_DO_BANCO_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
        players,
        gameOrder,
        deckDict: keyBy(deck, 'id'),
        activePlayerId: gameOrder[playerCount - 1], // Start with the last player in the order, so the first player will be the first to play in the next phase
        outcome: OUTCOME.SETUP,
      },
    },
  };
};

/**
 * [Card Play Phase] - Players play cards to bank teller queues
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
) => {
  const previousPlayerId = state.activePlayerId ?? null;
  const nextActivePlayerId = utils.turnOrder.getNextPlayerId(state.gameOrder, state.activePlayerId ?? '');
  const playerCount = utils.players.getPlayerCount(players);

  // START ROUND
  if (state.outcome === OUTCOME.SETUP) {
    const round: Round = utils.game.increaseRound(state.round);
    // Reshuffle deck
    const deckDict: Dictionary<ClientCard> = state.deckDict || {};
    const deck: UID[] = shuffle(Object.keys(deckDict));
    // Build tellers (use the first 3 capacity for 3 players, 4 for 4 players and 5 for 5 players)
    const tellers = buildTellers(playerCount, round.current);
    const deckWithoutKids = deck.filter((cardId) => !cardId.includes(CHARACTER_TYPES.KID));
    const kidCards = deck.filter((cardId) => cardId.includes(CHARACTER_TYPES.KID));

    // Each player gets 2 cards in their hand at the start of the game, it cannot be a KID
    for (let i = 0; i < playerCount; i++) {
      // Get two card in deckWithoutKids that belongs to the player, if it's a two player game, the cards must have different colors
      const playerId = state.gameOrder[i];
      const playerCards = deckWithoutKids.filter((cardId) => {
        const card = state.deckDict?.[cardId];
        return card?.playerId === playerId;
      });

      if (playerCount === 2) {
        // For two players, ensure different colors
        const card1 = playerCards[0];
        const card1Color = state.deckDict?.[card1]?.color;
        const card2 = playerCards.find((cardId) => {
          const card = state.deckDict?.[cardId];
          return card?.color !== card1Color;
        });
        players[playerId].hand = card2 ? [card1, card2] : [card1, playerCards[1]];
      } else {
        // For other player counts, just take the first two
        players[playerId].hand = playerCards.slice(0, 2);
      }

      // Remove assigned cards from deckWithoutKids
      players[playerId].hand.forEach((cardId) => {
        const index = deckWithoutKids.indexOf(cardId);
        if (index > -1) {
          deckWithoutKids.splice(index, 1);
        }
      });

      // Reset online trigger count for the new round
      players[playerId].onlineTriggers = [];
    }

    // Each teller gets a card in front of them to start the line, it cannot be a KID
    Object.values(tellers).forEach((teller) => {
      const cardId = deckWithoutKids.shift();
      if (cardId) {
        teller.queue.push(cardId);
        teller.lastEvent = {
          eventId: Date.now().toString(),
          playedCardId: cardId,
          effectType: TELLER_EFFECT_TYPE.STAY,
          queueBeforeEvent: [],
        };

        const index = deckWithoutKids.indexOf(cardId);
        if (index > -1) {
          deckWithoutKids.splice(index, 1);
        }
      }
    });

    // Make a draw deck with the remaining cards, it will have all the KID cards.
    const drawDeck = shuffle([...deckWithoutKids, ...kidCards]);

    utils.players.readyPlayers(players, nextActivePlayerId);

    return {
      update: {
        state: {
          phase: NA_FILA_DO_BANCO_PHASES.CARD_PLAY,
          round,
          activePlayerId: nextActivePlayerId,
          tellers,
          drawDeck: drawDeck,
          outcome: OUTCOME.CONTINUE,
          players,
          previousPlayerId,
        },
      },
    };
  }
  // CONTINUE ROUND: continue vs no deck
  const drawDeck: UID[] = state.drawDeck || [];
  const deckDict: Dictionary<ClientCard> = state.deckDict || {};

  const tellers: Dictionary<Teller> = state.tellers || {};

  // Reset all tellers events
  Object.values(tellers).forEach((teller) => {
    teller.lastEvent = null;
  });

  // Get played data for current player and update deck and tellers.
  const selectedTellerId: UID = players[previousPlayerId]?.selectedTellerId;
  const selectedCardId: UID = players[previousPlayerId]?.selectedCardId;
  const selectedNewCardId: UID | null = players[previousPlayerId]?.selectedNewCardId || null;
  const playedCard = deckDict[selectedCardId];

  // Handle Achievements
  switch (playedCard?.type) {
    case CHARACTER_TYPES.KID:
      increaseAchievement(store.achievements, previousPlayerId, 'kid', 1);
      break;
    case CHARACTER_TYPES.RETIREE:
      increaseAchievement(store.achievements, previousPlayerId, 'retiree', 1);
      break;
    case CHARACTER_TYPES.VETERAN:
      increaseAchievement(store.achievements, previousPlayerId, 'veteran', 1);
      break;
    case CHARACTER_TYPES.MOTHER:
      increaseAchievement(store.achievements, previousPlayerId, 'motherBaby', 1);
      break;
    case CHARACTER_TYPES.BUSINESSMAN:
      increaseAchievement(store.achievements, previousPlayerId, 'businessman', 1);
      break;
    case CHARACTER_TYPES.STUDENT:
      increaseAchievement(store.achievements, previousPlayerId, 'student', 1);
      break;
    case CHARACTER_TYPES.MOTOBOY:
      increaseAchievement(store.achievements, previousPlayerId, 'motoboy', 1);
      break;
    default:
      break;
  }
  if (playedCard?.playerId === previousPlayerId) {
    increaseAchievement(store.achievements, previousPlayerId, 'ownColor', 1);
  }
  if (playedCard?.playerId === 'neutral') {
    increaseAchievement(store.achievements, previousPlayerId, 'neutral', 1);
  }

  tellers[selectedTellerId].lastEvent = {
    eventId: Date.now().toString(),
    playedCardId: selectedCardId,
    effectType: TELLER_EFFECT_TYPE.STAY,
    queueBeforeEvent: [...tellers[selectedTellerId].queue], // Capture the state of the queue before the event
  };

  // Determine the effect type.
  let queue = tellers[selectedTellerId].queue;
  // If KID: When a kid is played in a line with another card of the same color as the kid, that card goes to the end of the line next to the kid.
  if (playedCard.type === CHARACTER_TYPES.KID) {
    const color = playedCard.color;
    const sameColorCardIndex = queue.findIndex((cardId) => deckDict[cardId]?.color === color);
    queue.push(selectedCardId); // The kid is always added to the end of the line
    // If there's another card of the same color, bring the adult next to the kid
    if (sameColorCardIndex !== -1) {
      const [sameColorCardId] = queue.splice(sameColorCardIndex, 1);
      queue.push(sameColorCardId);
      tellers[selectedTellerId].lastEvent.effectType = TELLER_EFFECT_TYPE.BRING_NEXT_TO_ME;
    }
  }

  // If CLIENT: Cut-in rules are based on the hierarchy defined in CUT_IN_HIERARCHY, if the card played can cut in front of any card in the line, it does so.
  if (playedCard.type !== CHARACTER_TYPES.KID) {
    const cutInIndex = queue.findIndex((cardId) => {
      if (!deckDict[cardId]) return false;
      const cardType = deckDict[cardId].type;
      return CUT_IN_HIERARCHY[playedCard.type].includes(cardType);
    });
    if (cutInIndex !== -1) {
      const cardGettingCut = deckDict[queue[cutInIndex + 1]];
      // Insert selected card in front of cutInIndex, keep the cut card there and move the rest of the line back
      const afterCutInCards = queue.splice(cutInIndex); // Cards that will be after the
      queue.push(selectedCardId);
      queue.push(...afterCutInCards);

      tellers[selectedTellerId].lastEvent.effectType = TELLER_EFFECT_TYPE.CUT_IN_FRONT;
      increaseAchievement(store.achievements, previousPlayerId, 'cutIns', 1);

      if (cardGettingCut && cardGettingCut.playerId !== 'neutral') {
        increaseAchievement(store.achievements, cardGettingCut.playerId, 'gotCut', 1);
      }
    } else {
      queue.push(selectedCardId);
      increaseAchievement(store.achievements, previousPlayerId, 'stays', 1);
    }
  }

  // Online effect: If 3 people of the same type are in the same line, remove them all
  const typeCounts: Record<string, number> = {};
  queue.forEach((cardId) => {
    const cardType = deckDict[cardId]?.type;
    if (cardType) {
      typeCounts[cardType] = (typeCounts[cardType] || 0) + 1;
    }
  });

  const onlineTriggeredTypes = Object.keys(typeCounts).filter((type) => typeCounts[type] >= 3);
  if (onlineTriggeredTypes.length > 0) {
    // Remove all cards of the triggered types from the queue
    let onlineTriggerType = '';
    queue = queue.filter((cardId) => {
      const cardType = deckDict[cardId]?.type;
      onlineTriggerType = cardType;
      return !onlineTriggeredTypes.includes(cardType || '');
    });
    tellers[selectedTellerId].lastEvent.effectType =
      tellers[selectedTellerId].lastEvent.effectType === TELLER_EFFECT_TYPE.BRING_NEXT_TO_ME
        ? TELLER_EFFECT_TYPE.BRING_NEXT_TO_ME_AND_REMOVE_THREE
        : TELLER_EFFECT_TYPE.REMOVE_THREE;

    players[previousPlayerId].onlineTriggers.push(onlineTriggerType);
    increaseAchievement(store.achievements, previousPlayerId, 'online', 1);
  }

  // Update player hand
  players[previousPlayerId].hand = players[previousPlayerId].hand.filter(
    (cardId: UID) => cardId !== selectedCardId,
  );
  if (selectedNewCardId) {
    players[previousPlayerId].hand.push(selectedNewCardId);
    drawDeck.splice(drawDeck.indexOf(selectedNewCardId), 1);
  }

  const isDeckEmpty = drawDeck.length <= 1;
  const doesNextActivePlayerHaveCards = players[nextActivePlayerId].hand.length > 1;

  utils.players.removePropertiesFromPlayers(players, [
    'selectedTellerId',
    'selectedCardId',
    'selectedNewCardId',
  ]);

  tellers[selectedTellerId].queue = queue;

  if (isDeckEmpty && !doesNextActivePlayerHaveCards) {
    utils.players.unReadyPlayers(players);

    return {
      update: {
        state: {
          phase: NA_FILA_DO_BANCO_PHASES.CARD_PLAY,
          players,
          outcome: OUTCOME.END_ROUND,
          previousPlayerId,
          tellers,
          drawDeck,
          activePlayerId: nextActivePlayerId,
        },
      },
    };
  }

  // Define next player
  utils.players.readyPlayers(players, nextActivePlayerId);

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: NA_FILA_DO_BANCO_PHASES.CARD_PLAY,
        players,
        activePlayerId: nextActivePlayerId,
        previousPlayerId,
        outcome: OUTCOME.CONTINUE,
        tellers,
        drawDeck,
      },
    },
  };
};

/**
 * [Round Resolution Phase] - Calculate scores and finalize the round
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRoundResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
) => {
  utils.players.unReadyPlayers(players);

  const gallery: UID[] = store.gallery || [];

  // Gained points [Teller A, Teller B, Teller C, Online Triggers]
  const scores = new utils.players.Scores(players, [0, 0, 0, 0]);

  const deckDict: Dictionary<ClientCard> = state.deckDict || {};
  const tellers: Dictionary<Teller> = state.tellers || {};

  // Perform scoring for each teller.
  orderBy(Object.values(tellers), ['id'], ['asc']).forEach((teller, tellerIndex) => {
    const { capacity, queue, doublers } = teller;

    teller.lastEvent = {
      eventId: Date.now().toString(),
      playedCardId: '',
      effectType: TELLER_EFFECT_TYPE.REMOVE_THREE,
      queueBeforeEvent: [...queue],
    };

    // Award points for the capacity of the line.
    teller.queue = teller.queue.slice(0, capacity.length); // Remove cards that exceed the teller's capacity

    teller.queue.forEach((cardId, queueIndex) => {
      const card = deckDict[cardId];
      if (card) {
        if (card.playerId === 'neutral') {
          gallery.push(cardId);
          return;
        }

        if (card.type === CHARACTER_TYPES.KID) {
          return; // KID cards do not score points
        }

        const playerId = card.playerId;
        scores.add(playerId, capacity[queueIndex], tellerIndex);
        gallery.push(cardId);
        if (doublers.includes(card.type)) {
          scores.add(playerId, capacity[queueIndex], tellerIndex);
        }
      }
    });
  });

  // Award points for online triggers
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.onlineTriggers.length > 0) {
      player.onlineTriggers.forEach((triggerType) => {
        const points =
          triggerType === CHARACTER_TYPES.KID ? ONLINE_TRIGGER_POINTS_KID : ONLINE_TRIGGER_POINTS;
        scores.add(player.id, points, 3); // Each online trigger is worth points based on type
      });
    }
  });

  return {
    update: {
      store: {
        gallery,
      },
      state: {
        phase: NA_FILA_DO_BANCO_PHASES.ROUND_RESOLUTION,
        players,
        tellers,
        activePlayerId: state.previousPlayerId,
        previousPlayerId: null,
        outcome: OUTCOME.SETUP,
        ranking: scores.rank(players),
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

  await utils.firestore.markGameAsComplete(gameId);

  const achievements = getAchievements(store.achievements);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.NA_FILA_DO_BANCO,
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
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: NA_FILA_DO_BANCO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery: store.gallery || [],
        deckDict: state.deckDict || {},
      },
    },
  };
};
