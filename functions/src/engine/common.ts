// Utils
import * as delegatorUtils from '../utils/delegators';
import * as utils from '../utils';

/**
 * Loads a new game instance
 * @param data
 * @returns
 */
export const loadGame = async (data: LoadGamePayload) => {
  const { gameId } = data;

  const actionText = 'load game';
  utils.firebase.verifyPayload(gameId, 'gameId', 'load game');

  const collectionName = delegatorUtils.getCollectionNameByGameId(gameId);

  if (!collectionName) {
    return utils.firebase.throwException(`there is no game engine for the given id: ${gameId}`, actionText);
  }

  // Get 'meta' from given game session
  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const gameMeta = await sessionRef.doc('meta').get();

  if (!gameMeta.exists) {
    return utils.firebase.throwException(`game ${gameId} does not exist`, actionText);
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
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(collectionName, 'collectionName', actionText);
  utils.firebase.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Remove symbols from the player name
  const cleanPlayerName = playerName.replace(/[\][(){},.:;!?<>%]/g, '');

  // Generate playerId by removing accents and lower casing the name
  const playerId = utils.players.generatePlayerId(cleanPlayerName);

  if (players?.[playerId]) {
    return players[playerId];
  }

  // Verify maximum number of players
  const { playerCounts } = delegatorUtils.getEngine(collectionName);
  const numPlayers = Object.keys(players).length;

  if (numPlayers === playerCounts.MAX) {
    utils.firebase.throwException(
      `Sorry, you can't join. Game ${gameId} already has the maximum number of players: ${playerCounts.MIN}`,
      actionText
    );
  }

  // Verify if game is locked
  const metaDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'meta', actionText);
  const meta = metaDoc.data() ?? {};

  if (meta?.isLocked) {
    utils.firebase.throwException(`This game ${gameId} is locked and cannot accept new players`, actionText);
  }

  try {
    const newPlayer = utils.players.createPlayer(playerId, cleanPlayerName, `${playerAvatarId}`, players);
    await sessionRef.doc('players').update({
      [playerId]: newPlayer,
    });
    return newPlayer;
  } catch (error) {
    utils.firebase.throwException(error, actionText);
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
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(collectionName, 'collectionName', actionText);
  utils.firebase.verifyPayload(playerId, 'playerId', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.players.readyPlayer(players, playerId);

  if (!utils.players.isEverybodyReady(updatedPlayers)) {
    try {
      const key = `${playerId}.ready`;
      await sessionRef.doc('players').update({ [key]: true });
      return true;
    } catch (error) {
      utils.firebase.throwException(error, actionText);
    }
  }

  const { getNextPhase } = delegatorUtils.getEngine(collectionName);

  // If all players are ready, trigger next phase
  try {
    return getNextPhase(collectionName, gameId, players);
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }
};

export const rateGame = async (data: ExtendedPayload) => {
  const { gameId, gameName: collectionName, playerId } = data;
  const actionText = 'submit ratings';

  try {
    await utils.firebase
      .getPublicRef()
      .doc('ratings')
      .collection(collectionName)
      .doc(playerId)
      .update({
        [gameId]: data.ratings,
      });
  } catch (e) {
    try {
      await utils.firebase
        .getPublicRef()
        .doc('ratings')
        .collection(collectionName)
        .doc(playerId)
        .set({
          [gameId]: data.ratings,
        });
    } catch (error) {
      utils.firebase.throwException(error, actionText);
    }
  }
  return false;
};
