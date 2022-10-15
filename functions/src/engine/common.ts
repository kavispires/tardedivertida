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
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);

  const metaRef = utils.firebase.getMetaRef();
  const gameMeta = await metaRef.doc(gameId).get();

  if (!gameMeta.exists) {
    return utils.firebase.throwException(`game ${gameId} does not exist`, actionText);
  }

  const gameMetaData = gameMeta.data();

  utils.firebase.verifyPayload(gameMetaData?.gameName, 'gameName', actionText);

  return gameMetaData;
};

/**
 * Add player to a game given gameId
 * @param data
 * @returns
 */
export const addPlayer = async (data: AddPlayerPayload) => {
  const { gameId, gameName, playerName, playerAvatarId } = data;

  const actionText = 'add player';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Remove symbols from the player name
  const cleanPlayerName = playerName.replace(/[\][(){},.:;!?<>%]/g, '');

  // Generate playerId by removing accents and lower casing the name
  const playerId = utils.players.generatePlayerId(cleanPlayerName);

  if (players?.[playerId]) {
    return players[playerId];
  }

  // Verify maximum number of players
  const { playerCounts } = delegatorUtils.getEngine(gameName);
  const numPlayers = Object.keys(players).length;

  if (numPlayers === playerCounts.MAX) {
    utils.firebase.throwException(
      `Sorry, you can't join. Game ${gameId} already has the maximum number of players: ${playerCounts.MIN}`,
      actionText
    );
  }

  // Verify if game is locked
  const metaDoc = await utils.firebase.getMetaDoc(gameId, actionText);
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
  const { gameId, gameName, playerId } = data;

  const actionText = 'make you ready';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyPayload(playerId, 'playerId', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', actionText);

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

  const { getNextPhase } = delegatorUtils.getEngine(gameName);

  // If all players are ready, trigger next phase
  try {
    return getNextPhase(gameName, gameId, players);
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }
};

export const rateGame = async (data: ExtendedPayload) => {
  const { gameId, gameName: gameName, playerId } = data;
  const actionText = 'submit ratings';

  try {
    await utils.firebase
      .getPublicRef()
      .doc('ratings')
      .collection(gameName)
      .doc(playerId)
      .update({
        [gameId]: data.ratings,
      });
  } catch (e) {
    try {
      await utils.firebase
        .getPublicRef()
        .doc('ratings')
        .collection(gameName)
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
