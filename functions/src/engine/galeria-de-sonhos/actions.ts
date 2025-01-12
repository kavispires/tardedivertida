// Types
import type { FirebaseStateData, ImageCard, PlayerCard } from './types';
// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitWord = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  wordId: string,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the word',
    change: { wordId },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitCards = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardsIds: string[],
) => {
  const cards = cardsIds.reduce((acc: PlainObject, cardId) => {
    acc[cardId] = {
      cardId,
      used: false,
      matchedPlayers: [],
      score: 0,
    };
    return acc;
  }, {});

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your cards',
    shouldReady: true,
    change: { cards },
    nextPhaseFunction: getNextPhase,
  });
};

export const handlePlayCard = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string,
) => {
  const actionText = 'play a card';

  // Get 'players' from given game session
  const { sessionRef, state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  const playersList = utils.players.getListOfPlayers(players);

  // Group each players in a dictionary of cardIds and players array
  const cardCache: Dictionary<PlayerId[]> = {};
  playersList.forEach((player) => {
    Object.values<PlayerCard>(player.cards).forEach((card) => {
      if (cardCache[card.cardId] === undefined) {
        cardCache[card.cardId] = [];
      }
      cardCache[card.cardId].push(player.id);
    });
  });

  let didPlayerJustFall = false;
  const playersWhoGotPoints: PlayerId[] = [];
  const completedPlayers: PlayerId[] = [];

  // Check matches (3 points for 1 match, 2 points for 2+ matches, 0 points for 0 match)
  const cardEntry = cardCache[cardId];
  const matchCount = cardEntry.length - 1;
  // If no match
  if (matchCount === 0) {
    // Mark player as fallen
    players[playerId].fallen = true;
    didPlayerJustFall = true;
  } else if (matchCount === 1) {
    cardEntry.forEach((pId: PlayerId) => {
      if (!players[pId].fallen) {
        players[pId].cards[cardId].score = 3;
        playersWhoGotPoints.push(pId);
      }
    });
  } else {
    cardEntry.forEach((pId: PlayerId) => {
      if (!players[pId].fallen) {
        players[pId].cards[cardId].score = 2;
        playersWhoGotPoints.push(pId);
      }
    });
  }

  // Mark all players matches as used
  cardEntry.forEach((pId: PlayerId) => {
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
    currentPlayerId = utils.players.getNextPlayer(state.gameOrder, currentPlayerId);
    tries += 1;

    if (!players[currentPlayerId].fallen && !players[currentPlayerId].skip) {
      nextActivePlayerId = currentPlayerId;
    }
  }

  const availableTurnOrder = state.gameOrder.filter((pId: PlayerId) => {
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

    const cardsLeftToMatch = utils.players.getListOfPlayers(players).reduce((acc, player) => {
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
    utils.firebase.throwException(error, 'Failed to update players');
  }

  return await utils.firestore.updateState({
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
