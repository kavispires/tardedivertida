// Types
import type { FirebaseStateData, ImageCard, PlayerCard } from './types';
// Services
import { throwHttpsError } from '../../services/firebase-core';
import { getStateReferences, updatePlayer, updateStore, updateState } from '../../services/game-session';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the player's chosen word for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the word
 * @param wordId - The selected word ID
 */
export const handleSubmitWord = async (gameName: string, gameId: UID, playerId: UID, wordId: string) => {
  return await updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the word',
    change: { wordId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's selected cards for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting cards
 * @param cardsIds - Array of selected card IDs
 */
export const handleSubmitCards = async (gameName: string, gameId: UID, playerId: UID, cardsIds: string[]) => {
  const cards = cardsIds.reduce((acc: PlainObject, cardId) => {
    acc[cardId] = {
      cardId,
      used: false,
      matchedPlayers: [],
      score: 0,
    };
    return acc;
  }, {});

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your cards',
    shouldReady: true,
    change: { cards },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Plays a card during the player's turn
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID playing a card
 * @param cardId - The card ID being played
 */
export const handlePlayCard = async (gameName: string, gameId: UID, playerId: UID, cardId: string) => {
  const actionText = 'play a card';

  // Get 'players' from given game session
  const { sessionRef, state, players } = await getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  const playersList = getListOfPlayers(players);

  // Group each players in a dictionary of cardIds and players array
  const cardCache: Dictionary<UID[]> = {};
  playersList.forEach((player) => {
    Object.values<PlayerCard>(player.cards).forEach((card) => {
      if (cardCache[card.cardId] === undefined) {
        cardCache[card.cardId] = [];
      }
      cardCache[card.cardId].push(player.id);
    });
  });

  let didPlayerJustFall = false;
  const playersWhoGotPoints: UID[] = [];
  const completedPlayers: UID[] = [];

  // Check matches (3 points for 1 match, 2 points for 2+ matches, 0 points for 0 match)
  const cardEntry = cardCache[cardId];
  const matchCount = cardEntry.length - 1;
  // If no match
  if (matchCount === 0) {
    // Mark player as fallen
    players[playerId].fallen = true;
    didPlayerJustFall = true;
  } else if (matchCount === 1) {
    cardEntry.forEach((pId: UID) => {
      if (!players[pId].fallen) {
        players[pId].cards[cardId].score = 3;
        playersWhoGotPoints.push(pId);
      }
    });
  } else {
    cardEntry.forEach((pId: UID) => {
      if (!players[pId].fallen) {
        players[pId].cards[cardId].score = 2;
        playersWhoGotPoints.push(pId);
      }
    });
  }

  // Mark all players matches as used
  cardEntry.forEach((pId: UID) => {
    players[pId].cards[cardId].used = true;
  });

  // Mark players as fallen if all their cards were just used
  playersList.forEach((player: Player) => {
    const isPlayerComplete =
      playersWhoGotPoints.includes(player.id) &&
      Object.values<PlayerCard>(player.cards).every((card) => card.used);
    if (isPlayerComplete) {
      player.skip = true;
      completedPlayers.push(player.id);
    }
  });

  let cardsLeft = 0;

  // Mark card in table as used
  state.table.forEach((tableCardEntry: ImageCard) => {
    if (tableCardEntry.id === cardId) {
      tableCardEntry.used = true;
      tableCardEntry.matchedPlayers = cardCache[cardId];
    }
    if (!tableCardEntry.used) {
      cardsLeft++;
    }
  });

  // Assign next player (who hasn't fallen, if all has fallen, next phase)
  let nextActivePlayerId = '';
  let currentPlayerId = state.activePlayerId;
  let tries = 0;
  while (!nextActivePlayerId && tries <= playersList.length) {
    currentPlayerId = turnOrderUtils.getNextPlayerId(state.gameOrder, currentPlayerId);
    tries += 1;

    if (!players[currentPlayerId].fallen && !players[currentPlayerId].skip) {
      nextActivePlayerId = currentPlayerId;
    }
  }

  const availableTurnOrder = state.gameOrder.filter((pId: UID) => {
    return !players[pId].fallen && !players[pId].skip;
  });

  players[playerId].ready = true;
  if (nextActivePlayerId) {
    players[nextActivePlayerId].ready = false;
  }

  // Shame falling
  const shameFalling: PlainObject = {};
  if (didPlayerJustFall) {
    shameFalling.shameFallenPlayerId = playerId;
  }

  // If there are nobody else available
  if (availableTurnOrder.length === 0) {
    shameFalling.isPhaseOver = true;
  }

  // If there's only one player available, check if there are cards to be matched, otherwise end the round
  if (availableTurnOrder.length === 1) {
    const leftOverPlayerId = availableTurnOrder[0];

    const cardsLeftToMatch = getListOfPlayers(players).reduce((acc, player) => {
      if (player.id !== leftOverPlayerId) {
        let sum = acc;
        const cards: PlayerCard[] = Object.values(player.cards);
        sum += cards.filter((card) => !card.used).length;
        return sum;
      }
      return acc;
    }, 0);

    if (cardsLeftToMatch === 0) {
      shameFalling.isPhaseOver = true;
      // If its the player in danger, mark as fallen
      if (players[leftOverPlayerId].inNightmare) {
        players[leftOverPlayerId].fallen = true;
      }
    }
  }

  // Update players
  try {
    await sessionRef.doc('state').update({ players });
  } catch (error) {
    throwHttpsError(error, 'Failed to update players');
  }

  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'next card play',
    change: {
      latest: {
        cardId,
        completedPlayers,
        matchCount,
        matchedPlayers: cardCache[cardId],
        cardsLeft,
        ...shameFalling,
      },
      lastActivePlayerId: playerId,
      activePlayerId: nextActivePlayerId ?? 'END_ROUND',
      turnCount: state.turnCount + 1,
      table: state.table,
      gameOrder: availableTurnOrder,
    },
  });
};
