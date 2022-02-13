import * as delegatorUtils from '../utils/delegators';
import * as firebaseUtils from '../utils/firebase';
import * as utils from '../utils/helpers';
import { AddPlayerPayload, LoadGamePayload, Players, Payload, ExtendedPayload } from '../utils/types';

/**
 * Loads a new game instance
 * @param data
 * @returns
 */
export const loadGame = async (data: LoadGamePayload) => {
  const { gameId } = data;

  const actionText = 'load game';
  firebaseUtils.verifyPayload(gameId, 'gameId', 'load game');

  const collectionName = delegatorUtils.getCollectionNameByGameId(gameId);

  if (!collectionName) {
    return firebaseUtils.throwException(`there is no game engine for the given id: ${gameId}`, actionText);
  }

  // Get 'meta' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const gameMeta = await sessionRef.doc('meta').get();

  if (!gameMeta.exists) {
    return firebaseUtils.throwException(`game ${gameId} does not exist`, actionText);
  }

  return gameMeta.data();
};

/**
 * Add player to a game given gameId
 * @param data
 * @returns
 */
export const addPlayer = async (data: AddPlayerPayload) => {
  const { gameId, gameName: collectionName, playerName, playerAvatarId } = data;

  const actionText = 'add player';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Remove symbols from the player name
  const cleanPlayerName = playerName.replace(/[\][(){},.:;!?<>%]/g, '');

  // Generate playerId by removing accents and lower casing the name
  const playerId = utils.generatePlayerId(cleanPlayerName);

  if (players?.[playerId]) {
    return players[playerId];
  }

  // Verify maximum number of players
  const { playerCounts } = delegatorUtils.getEngine(collectionName);
  const numPlayers = Object.keys(players).length;

  if (numPlayers === playerCounts.MAX) {
    firebaseUtils.throwException(
      `Sorry, you can't join. Game ${gameId} already has the maximum number of players: ${playerCounts.MIN}`,
      actionText
    );
  }

  // Verify if game is locked
  const metaDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'meta', actionText);
  const meta = metaDoc.data() ?? {};

  if (meta?.isLocked) {
    firebaseUtils.throwException(`This game ${gameId} is locked and cannot accept new players`, actionText);
  }

  try {
    const newPlayer = utils.createPlayer(playerId, cleanPlayerName, `${playerAvatarId}`, players);
    await sessionRef.doc('players').update({
      [playerId]: newPlayer,
    });
    return newPlayer;
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }
};

/**
 * Makes player ready, if all players are ready
 * @param data
 * @returns
 */
export const makePlayerReady = async (data: Payload) => {
  const { gameId, gameName: collectionName, playerId } = data;

  const actionText = 'make you ready';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);

  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);

  if (!utils.isEverybodyReady(updatedPlayers)) {
    try {
      const key = `${playerId}.ready`;
      await sessionRef.doc('players').update({ [key]: true });
      return true;
    } catch (error) {
      firebaseUtils.throwException(error, actionText);
    }
  }

  const { getNextPhase } = delegatorUtils.getEngine(collectionName);

  // If all players are ready, trigger next phase
  try {
    return getNextPhase(collectionName, gameId, players);
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }
};

export const rateGame = async (data: ExtendedPayload) => {
  const { gameId, gameName: collectionName, playerId } = data;
  const actionText = 'submit ratings';

  try {
    await firebaseUtils
      .getPublicRef()
      .doc('ratings')
      .collection(collectionName)
      .doc(playerId)
      .update({
        [gameId]: data.ratings,
      });
  } catch (e) {
    try {
      await firebaseUtils
        .getPublicRef()
        .doc('ratings')
        .collection(collectionName)
        .doc(playerId)
        .set({
          [gameId]: data.ratings,
        });
    } catch (error) {
      firebaseUtils.throwException(error, actionText);
    }
  }
  return false;
};
