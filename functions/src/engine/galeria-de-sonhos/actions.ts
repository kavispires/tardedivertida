// Types
import { GameId, PlayerId, GameName, PlainObject, Player } from '../../utils/types';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
// Internal functions
import { getNextPhase } from './index';
import * as utils from '../../utils/helpers';
import { ImageCard } from './types';

export const handleSubmitWord = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  wordId: string
) => {
  return await firebaseUtils.updateStore({
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

  return await firebaseUtils.updatePlayer({
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
  console.log({ cardId });

  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
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

  console.log({ cardCache });

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

  console.log('done scoring');

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
  const availableTurnOrder = state.gameOrder.filter((pId: PlayerId) => {
    return !players[pId].fallen;
  });

  const nextActivePlayerId = utils.getNextPlayer(availableTurnOrder, state.activePlayerId);
  players[playerId].ready = true;
  players[nextActivePlayerId].ready = true;

  // Update players
  try {
    await sessionRef.doc('players').update(players);
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to update players');
  }

  // Shame falling
  const shameFalling: PlainObject = {};
  if (didPlayerJustFallen) {
    shameFalling.shameFallenPlayerId = playerId;
  }

  return await firebaseUtils.updateState({
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