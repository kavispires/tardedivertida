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

function verifyPayload(property?: string, propertyName = 'unknown property', action = 'function') {
  if (!property) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: a ${propertyName} is required`);
  }
}

function verifyAuth(context: any, action = 'perform function') {
  // Verify auth
  const uid = context?.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: you must be logged in`);
  }
}

export const helloWorld = functions.https.onCall(async () => {
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

  verifyPayload(gameId, 'gameId', 'load game');

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

exports.addPlayer = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName, playerAvatarId } = data;

  verifyPayload(gameId, 'gameId', 'add player');
  verifyPayload(collectionName, 'collectionName', 'add player');
  verifyPayload(playerName, 'playerName', 'add player');

  // Get 'state' from given game session
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

  if (players[playerName]) {
    console.log('Player exists!');
    return players[playerName];
  }

  console.log('Creating player');
  const methods = utils.getGameMethodsByCollection(collectionName);
  players[playerName] = methods.createPlayer(playerName, playerAvatarId, players);
  await gameStateRef.update({
    ...gameStateData,
    players,
  });

  return players[playerName];
});

exports.lockGame = functions.https.onCall(async (data, context) => {
  const { gameId, gameName: collectionName } = data;

  verifyPayload(gameId, 'gameId', 'add player');
  verifyPayload(collectionName, 'collectionName', 'add player');
  verifyAuth(context, 'lock game');

  // Find game state and get all players
  // Get 'state' from given game session
  const gameSessionRef = admin.firestore().collection(collectionName).doc(gameId).collection('session');

  const gameState = await gameSessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to add player: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // Parse players into two objects: info with static information, state with variable information (score, etc)
  const gameStateData = gameState.data();
  const players = gameStateData?.players;
  const methods = utils.getGameMethodsByCollection(collectionName);
  const { state, info } = methods.lockGame(players);

  // Set info with players object and isLocked
  await gameSessionRef.doc('info').set(info);
  // Set state with players variable info and new phase Rules
  await gameSessionRef.doc('state').set(state);

  return info;
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
