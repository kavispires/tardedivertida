// Types
import type { FirebaseAuth } from '../types/reference';
// Services
import { verifyPayload, throwHttpsError } from '../services/firebase-core';
import {
  getMetaCollectionRef,
  getPublicCollectionRef,
  getUserCollectionRef,
} from '../services/firestore-core';
import { fetchGameMetaDoc, getStateReferences } from '../services/game-session';
// Mechanics
import {
  createDevPlayer,
  createPlayer,
  generatePlayerId,
  getPlayerCount,
  isEverybodyReady,
  setPlayersReadyState,
} from '../mechanics/players';
// Internal
import * as delegatorUtils from '../games/delegators';

/**
 * Payload for loading an existing game session
 */
type LoadGamePayload = {
  /**
   * Unique identifier of the game session to load
   */
  gameId: UID;
};

/**
 * Loads a new game instance
 * @param data - The payload containing the game ID
 */
const loadGame = async (data: LoadGamePayload) => {
  const { gameId } = data;

  const actionText = 'load game';
  verifyPayload(gameId, 'gameId', actionText);

  const metaRef = getMetaCollectionRef();
  const gameMeta = await metaRef.doc(gameId).get();

  if (!gameMeta.exists) {
    return throwHttpsError(`game ${gameId} does not exist`, actionText);
  }

  const gameMetaData = gameMeta.data();

  verifyPayload(gameMetaData?.gameName, 'gameName', actionText);

  return gameMetaData;
};

/**
 * Payload for a player joining a game session
 */
interface JoinGamePayload {
  /**
   * Unique identifier of the game session
   */
  gameId: UID;
  /**
   * The name of the game
   */
  gameName: string;
  /**
   * Display name for the player
   */
  playerName: string;
  /**
   * Avatar identifier chosen by the player
   */
  playerAvatarId: string;
  /**
   * Whether the player is joining as a guest
   */
  isGuest?: boolean;
}

/**
 * Add player to a game given gameId
 * @param data - The payload containing game and player information
 * @param auth - The Firebase authentication object
 */
const joinGame = async (data: JoinGamePayload, auth: FirebaseAuth) => {
  const { gameId, gameName, playerName, playerAvatarId, isGuest } = data;

  const actionText = 'add player';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(playerName, 'playerName', actionText);

  // Get 'state.players' from given game session
  const { sessionRef, state } = await getStateReferences<DefaultState>(gameName, gameId, actionText);

  const players = state?.players ?? {};

  // Remove symbols from the player name
  const cleanPlayerName = playerName.replace(/[\][(){},.:;!?<>%]/g, '');

  // Generate playerId by removing accents and lower casing the name
  const playerId = auth?.uid ?? generatePlayerId(cleanPlayerName);

  if (players?.[playerId]) {
    return players[playerId];
  }

  // Verify maximum number of players
  const { getPlayerCounts } = await delegatorUtils.getEngine(gameName);
  const playerCounts = getPlayerCounts();
  const numPlayers = getPlayerCount(players);

  if (numPlayers === playerCounts.MAX) {
    throwHttpsError(
      `Sorry, you can't join. Game ${gameId} already has the maximum number of players: ${playerCounts.MIN}`,
      actionText,
    );
  }

  // Verify if game is locked
  const metaDoc = await fetchGameMetaDoc(gameId, actionText);
  const meta = metaDoc.data() ?? {};

  if (meta?.isLocked) {
    throwHttpsError(`This game ${gameId} is locked and cannot accept new players`, actionText);
  }

  // DEV MODE
  if (playerName === '<dev>') {
    try {
      const newPlayer = createDevPlayer(players, auth?.uid ?? String(Date.now()));
      const path = `players.${playerId}`;
      await sessionRef.doc('state').update({
        [path]: newPlayer,
      });
      return newPlayer;
    } catch (error) {
      throwHttpsError(error, actionText);
    }
  }

  try {
    const newPlayer = createPlayer(playerId, cleanPlayerName, `${playerAvatarId}`, players, isGuest);
    const path = `players.${playerId}`;
    await sessionRef.doc('state').update({
      [path]: newPlayer,
    });
    return newPlayer;
  } catch (error) {
    throwHttpsError(error, actionText);
  }
};

/**
 * Makes player ready, if all players are ready triggers the next phase
 * @param data - The payload containing game and player information
 */
const makeMeReady = async (data: Payload<{ onlyReady?: boolean }>) => {
  const { gameId, gameName, playerId, onlyReady } = data;

  const actionText = 'make you ready';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(playerId, 'playerId', actionText);

  // Get 'state.players' from given game session
  const { sessionRef, state } = await getStateReferences<DefaultState>(gameName, gameId, actionText);

  const players = state?.players ?? {};
  setPlayersReadyState(players, true, { targetIds: [playerId] });

  if (onlyReady || !isEverybodyReady(players)) {
    try {
      const path = `players.${playerId}.ready`;
      await sessionRef.doc('state').update({ [path]: true });
      return true;
    } catch (error) {
      throwHttpsError(error, actionText);
    }
  }

  if (onlyReady) {
    return true;
  }

  const { getNextPhase } = await delegatorUtils.getEngine(gameName);

  // If all players are ready, trigger next phase
  try {
    return getNextPhase(gameName, gameId);
  } catch (error) {
    throwHttpsError(error, actionText);
  }
};

/**
 * Saves game ratings to user profile or public ratings collection
 * @param data - The extended payload containing ratings information
 * @param auth - The Firebase authentication object
 */
const rateGame = async (data: ExtendedPayload, auth: FirebaseAuth) => {
  const { gameId, gameName, playerId } = data;
  const actionText = 'submit ratings';

  const uid = auth?.uid;

  // If user has an ui, save it to the user profile
  if (uid) {
    try {
      const path = `games.${gameName}.[0]`;
      await getUserCollectionRef()
        .doc(uid)
        .update({
          [`${path}.rating`]: data.ratings.rating,
          [`${path}.comments`]: data.ratings.comments,
        });
      return true;
    } catch {
      // do nothing, let it try save it to the ratings public doc
    }
  }

  try {
    await getPublicCollectionRef()
      .doc('ratings')
      .collection(gameName)
      .doc(playerId)
      .update({
        [gameId]: data.ratings,
      });
  } catch {
    try {
      await getPublicCollectionRef()
        .doc('ratings')
        .collection(gameName)
        .doc(playerId)
        .set({
          [gameId]: data.ratings,
        });
    } catch (error) {
      throwHttpsError(error, actionText);
    }
  }
  return true;
};

export const gameSessionActions = {
  LOAD_GAME: loadGame,
  JOIN_GAME: joinGame,
  MAKE_ME_READY: makeMeReady,
  RATE_GAME: rateGame,
};
