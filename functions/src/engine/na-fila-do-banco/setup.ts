// functions/src/engine/na-fila-do-banco/setup.ts
import { CHARACTER_TYPES, NA_FILA_DO_BANCO_PHASES, OUTCOME, TOTAL_ROUNDS } from './constants';
import { keyBy, shuffle } from 'lodash';
// Utils
import utils from '../../utils';
import type { ClientCard, FirebaseStateData, FirebaseStoreData } from './types';
import { buildDeck, buildTellers } from './helpers';
import { GAME_NAMES } from '../../utils/constants';

export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
) => {
  const deck = buildDeck(players);

  const { gameOrder } = utils.turnOrder.create(players);
  const playerCount = utils.players.getPlayerCount(players);

  const achievements = utils.achievements.setup(players, {
    kids: 0,
    retiree: 0,
    veteran: 0,
    motherBaby: 0,
    businessman: 0,
    student: 0,
    motoboy: 0,
    online: 0,
    ownColor: 0,
    neutral: 0,
  });

  return {
    update: {
      store: {
        achievements,
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

export const prepareCardPlayPhase = async (
  _store: FirebaseStoreData,
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
    utils.helpers.print(deckDict);
    const deckWithoutKids = deck.filter((cardId) => !cardId.includes(CHARACTER_TYPES.KID));
    const kidCards = deck.filter((cardId) => cardId.includes(CHARACTER_TYPES.KID));
    utils.helpers.print(deckWithoutKids);
    console.log('total without kids', deckWithoutKids.length, 'expected', (playerCount + 1) * 6);

    utils.helpers.print({ 'total kids': kidCards.length });
    console.log('total kids', kidCards.length, 'expected', 7);

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

      console.log('Cards in hand', players[playerId].hand);
    }

    // Each teller gets a card in front of them to start the line, it cannot be a KID
    Object.values(tellers).forEach((teller) => {
      const cardId = deckWithoutKids.shift();
      if (cardId) {
        teller.queue.push(cardId);
        teller.nextQueue.push(cardId);

        const index = deckWithoutKids.indexOf(cardId);
        if (index > -1) {
          deckWithoutKids.splice(index, 1);
        }
      }
    });

    // Make a draw deck with the remaining cards, it will have all the KID cards.
    const drawDeck = shuffle([...deckWithoutKids, ...kidCards]);

    console.log('Initial draw deck', drawDeck);

    utils.players.readyPlayers(players, nextActivePlayerId);

    return {
      update: {
        state: {
          phase: NA_FILA_DO_BANCO_PHASES.CARD_PLAY,
          round,
          activePlayerId: nextActivePlayerId,
          tellers,
          drawDeck,
          outcome: OUTCOME.CONTINUE,
          players,
          previousPlayerId,
        },
      },
    };
  }
  // CONTINUE ROUND: continue vs no deck
  const drawDeck: UID[] = state.drawDeck || [];
  const isDeckEmpty = drawDeck.length <= 1; // TODO: Fix, it should end when players have 1 card in hand

  // Get played data for current player and update deck and tellers.
  // Apply cut-in rules based on the card, KID rule, or ONLINE rule if applicable, in this order
  // Cut-in rules are based on the hierarchy defined in CUT_IN_HIERARCHY, if the card played can cut in front of any card in the line, it does so. If it cannot cut in front of any card, it goes to the end of the line.
  // KID rule: When a kid is played in a line with another card of the same color as the kid, that card goes to the end of the line next to the kid.
  // ONLINE "we can do this online": If 3 people of the same type are in the same line, they are removed from the line and placed in the discard pile. The player who triggered it gets 1 points. (2 points if it was a set of KIDs).

  if (isDeckEmpty) {
    utils.players.unReadyPlayers(players);

    return {
      update: {
        state: {
          phase: NA_FILA_DO_BANCO_PHASES.CARD_PLAY,
          players,
          outcome: OUTCOME.END_ROUND,
          previousPlayerId,
          // no activePlayerId is updated
        },
      },
    };
  }

  // Define next player
  utils.players.unReadyPlayers(players, nextActivePlayerId);

  return {
    update: {
      state: {
        phase: NA_FILA_DO_BANCO_PHASES.CARD_PLAY,
        players,
        activePlayerId: nextActivePlayerId,
        previousPlayerId,
      },
    },
  };
};

export const prepareRoundResolutionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
) => {
  utils.players.unReadyPlayers(players);

  // Perform scoring for each teller.

  return {
    update: {
      state: {
        phase: NA_FILA_DO_BANCO_PHASES.ROUND_RESOLUTION,
        players,
      },
    },
  };
};

/**
 * Prepare game over phase
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  await utils.firestore.markGameAsComplete(gameId);

  // const achievements = getAchievements(store);
  const achievements = [];

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
        gallery: store.gallery,
      },
    },
  };
};
