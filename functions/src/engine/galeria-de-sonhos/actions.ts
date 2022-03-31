// Types
import { GameId, PlayerId, GameName, PlainObject, Player } from '../../utils/types';
import { ImageCardId } from './types';
// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitWord = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  wordId: string
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the word',
    change: { wordId },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitCards = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardsIds: string[]
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

  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your cards',
    shouldReady: true,
    change: { cards },
    nextPhaseFunction: getNextPhase,
  });
};

export const handlePlayCard = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string
) => {
  const actionText = 'play a card';

  // Get 'players' from given game session
  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  const cardCache: PlainObject = {};
  Object.values(players).forEach((player) => {
    Object.values(player.cards).forEach((card: any) => {
      if (cardCache[card.cardId] === undefined) {
        cardCache[card.cardId] = [];
      }
      cardCache[card.cardId].push(player.id);
    });
  });

  let didPlayerJustFallen = false;
  const playersWhoGotPoints: PlayerId[] = [];
  const fallenPlayers: PlayerId[] = [];

  // Check matches (3 points for 1 match, 2 points for 2+ matches, 0 points for 0 match)
  const cardEntry = cardCache[cardId];
  const matchCount = cardEntry.length - 1;
  // If no match
  if (matchCount === 0) {
    // Mark player as fallen
    players[playerId].fallen = true;
    didPlayerJustFallen = true;
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
  Object.values(players).forEach((player: Player) => {
    const hasFallen =
      playersWhoGotPoints.includes(player.id) && Object.values(player.cards).every((card: any) => card.used);
    if (hasFallen) {
      player.fallen = true;
      fallenPlayers.push(player.id);
    }
  });

  let cardsLeft = 0;

  // Mark card in table as used
  state.table.forEach((tableCardEntry: ImageCardId) => {
    if (tableCardEntry.id === cardId) {
      tableCardEntry.used = true;
      tableCardEntry.matchedPlayers = cardCache[cardId];
    }
    if (!tableCardEntry.used) {
      cardsLeft++;
    }
  });

  // Assign next player (who hasn't fallen, if all has fallen, next phase)
  const availableTurnOrder = state.gameOrder.filter((pId: PlayerId) => {
    return !players[pId].fallen;
  });

  const nextActivePlayerId = utils.players.getNextPlayer(availableTurnOrder, state.activePlayerId);
  players[playerId].ready = true;
  players[nextActivePlayerId].ready = true;

  // Update players
  try {
    await sessionRef.doc('players').update(players);
  } catch (error) {
    utils.firebase.throwException(error, 'Failed to update players');
  }

  // Shame falling
  const shameFalling: PlainObject = {};
  if (didPlayerJustFallen) {
    shameFalling.shameFallenPlayerId = playerId;
  }

  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'next card play',
    change: {
      latest: {
        cardId,
        fallenPlayers,
        matchCount,
        matchedPlayers: cardCache[cardId],
        cardsLeft,
        ...shameFalling,
      },
      lastActivePlayerId: playerId,
      activePlayerId: nextActivePlayerId,
      turnCount: state.turnCount + 1,
      table: state.table,
    },
  });
};
