// Utils
import * as delegatorUtils from '../utils/delegators';
import utils from '../utils';

/**
 * Loads a new game instance
 * @param data
 * @returns
 */
const loadGame = async (data: LoadGamePayload) => {
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
const addPlayer = async (data: AddPlayerPayload, context: FirebaseContext) => {
  const { gameId, gameName, playerName, playerAvatarId, isGuest } = data;

  const actionText = 'add player';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyPayload(playerName, 'playerName', actionText);

  // Get 'state.players' from given game session
  const { sessionRef, state } = await utils.firebase.getStateReferences<DefaultState>(
    gameName,
    gameId,
    actionText
  );

  const players = state?.players ?? {};

  // Remove symbols from the player name
  const cleanPlayerName = playerName.replace(/[\][(){},.:;!?<>%]/g, '');

  // Generate playerId by removing accents and lower casing the name
  const playerId = context?.auth?.uid ?? utils.players.generatePlayerId(cleanPlayerName);

  if (players?.[playerId]) {
    return players[playerId];
  }

  // Verify maximum number of players
  const { playerCounts } = delegatorUtils.getEngine(gameName);
  const numPlayers = utils.players.getPlayerCount(players);

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
    const newPlayer = utils.players.createPlayer(
      playerId,
      cleanPlayerName,
      `${playerAvatarId}`,
      players,
      isGuest
    );
    const path = `players.${playerId}`;
    await sessionRef.doc('state').update({
      [path]: newPlayer,
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
const makePlayerReady = async (data: Payload) => {
  const { gameId, gameName, playerId } = data;

  const actionText = 'make you ready';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyPayload(playerId, 'playerId', actionText);

  // Get 'state.players' from given game session
  const { sessionRef, state } = await utils.firebase.getStateReferences<DefaultState>(
    gameName,
    gameId,
    actionText
  );

  const players = state?.players ?? {};
  const updatedPlayers = utils.players.readyPlayer(players, playerId);

  if (!utils.players.isEverybodyReady(updatedPlayers)) {
    try {
      const path = `players.${playerId}.ready`;
      await sessionRef.doc('state').update({ [path]: true });
      return true;
    } catch (error) {
      utils.firebase.throwException(error, actionText);
    }
  }

  const { getNextPhase } = delegatorUtils.getEngine(gameName);

  // If all players are ready, trigger next phase
  try {
    return getNextPhase(gameName, gameId);
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }
};

const rateGame = async (data: ExtendedPayload, context: FirebaseContext) => {
  const { gameId, gameName, playerId } = data;
  const actionText = 'submit ratings';

  const uid = context?.auth?.uid;

  // If user has an ui, save it to the user profile
  if (uid) {
    try {
      const path = `games.${gameName}.[0]`;
      await utils.firebase
        .getUserRef()
        .doc(uid)
        .update({
          [`${path}.rating`]: data.ratings.rating,
          [`${path}.comments`]: data.ratings.comments,
        });
      return true;
    } catch (e) {
      // do nothing, let it try save it to the ratings public doc
    }
  }

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
  return true;
};

const GAME_API_ACTIONS = {
  LOAD_GAME: loadGame,
  ADD_PLAYER: addPlayer,
  MAKE_PLAYER_READY: makePlayerReady,
  RATE_GAME: rateGame,
};

export const gameApi = utils.firebase.apiDelegator('game api', GAME_API_ACTIONS);
