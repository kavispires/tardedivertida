import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from './utils/index';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const helloWorld = functions.https.onCall(async (data, context) => {
  return 'hello world';
});

export const initializeGame = functions.https.onCall(async (data, context) => {
  // Verify auth
  const uid = context?.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create new game: you must be logged in to create a game'
    );
  }

  // Get collection name by game code on request
  const { gameCode } = data;

  if (!gameCode) {
    throw new functions.https.HttpsError('internal', 'Failed to create new game: a gameCode is required');
  }

  const collectionName = utils.getCollectionNameByGameCode(gameCode);

  if (!collectionName) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create new game: provided gameCode is invalid ${gameCode}`
    );
  }

  // Get list of code ids present in database
  const collectionRef = admin.firestore().collection(collectionName);

  // Generate unique 4 digit code starting with game code letter
  let gameId: string | null = null;
  while (!gameId) {
    const tempId = utils.generateGameId(gameCode);
    const tempDoc = await collectionRef.doc(tempId).get();
    if (!tempDoc.exists) {
      gameId = tempId;
    }
  }

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await collectionRef.doc(gameId).get();
  if (tempGame.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create new game: the generated game id ${gameCode} belongs to an existing session`
    );
  }

  // Create game entry in database
  let response = {};
  try {
    const session = collectionRef.doc(gameId).collection('session');

    const methods = utils.getGameMethodsByCollection(collectionName);

    const { meta, info, state, store } = methods?.getInitialSession(gameId, uid);

    await session.doc('meta').set(meta);
    await session.doc('info').set(info);
    await session.doc('state').set(state);
    await session.doc('store').set(store);

    response = meta;
  } catch (e) {
    console.error(e);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create new game in the firestore database: ${e}`
    );
  }

  return {
    ...response,
  };
});

exports.loadGame = functions.https.onCall(async (data) => {
  // Extract gameCode to figure out
  const { gameId } = data;

  if (!gameId) {
    throw new functions.https.HttpsError('internal', 'Failed to load game: a gameId is required');
  }

  const collectionName = utils.getCollectionNameByGameId(gameId);

  if (!collectionName) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to load game: there is no game engine for the given id: ${gameId}`
    );
  }

  // Get 'meta' from given game session
  const gameMeta = await admin
    .firestore()
    .collection(collectionName)
    .doc(gameId)
    .collection('session')
    .doc('meta')
    .get();

  if (!gameMeta.exists) {
    throw new functions.https.HttpsError('internal', `Failed to load game: game ${gameId} does not exist`);
  }

  return gameMeta.data();
});

exports.addPlayer = functions.https.onCall(async (data, context) => {
  const { gameId, gameName: collectionName, playerName, playerAvatarId } = data;

  if (!gameId || !collectionName || !playerName) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to add player: payload is missing ${!gameId && 'gameId'} ${
        !collectionName && 'collectionName'
      } ${!playerName}`
    );
  }

  // Get 'info' from given game session
  const gameStateRef = admin
    .firestore()
    .collection(collectionName)
    .doc(gameId)
    .collection('session')
    .doc('state');

  const gameState = await gameStateRef.get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to add player: game '${collectionName}/${gameId}' does not exist`
    );
  }

  const gameStateData = gameState.data();
  const players = gameStateData?.players;

  console.log({ gameStateData });
  if (players[playerName]) {
    console.log('Player exists!');
    return players[playerName];
  }

  console.log('Creating player');
  const methods = utils.getGameMethodsByCollection(collectionName);
  players[playerName] = methods.createPlayer(playerName, playerAvatarId, players);
  gameStateRef.update({
    ...gameStateData,
    players,
  });

  return players[playerName];
});

exports.lockGame = functions.https.onCall(async (data, context) => {
  const { gameId, game: collectionName } = data;

  if (!gameId || !collectionName) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to lock game: payload is missing ${!gameId && 'gameId'} ${!collectionName && 'collectionName'}`
    );
  }

  // Verify auth
  const uid = context?.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      'internal',
      'Failed to lock game: you must be logged in to lock a game'
    );
  }

  // Find game state and get all players

  // Parse players into two objects: info with static information, state with variable information (score, etc)

  // Set info with players object and isLocked

  // Set meta with players variable info and new phase Rules
});

// exports.arteRuimAPI = functions.https.onRequest((request, response) => {
//   switch (request.action) {
//     case 'ACTION_1':
//       response.send('arteRuimAPI ACTION 1');
//       break;
//     default:
//       response.send('arteRuimAPI default');
//   }
// });
