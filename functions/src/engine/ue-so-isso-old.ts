// import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT, PHASES } from '../utils/constants';
// import * as firebaseUtils from '../utils/firebase';
// import * as gameUtils from '../utils/game-utils';
// import * as utils from '../utils/helpers';
// import {
//   Players,
//   Player,
//   GameId,
//   UeSoIssoInitialState,
//   SubmitVotesPayload,
//   SubmitSuggestionsPayload,
//   CurrentSuggestions,
//   SubmitSuggestionsValidationPayload,
//   ConfirmGuessPayload,
// } from '../utils/interfaces';
// // Resources
// import { allWordsBR } from '../resources/ue-so-isso-words';

// export const submitWordSelectionVotes = async (data: SubmitVotesPayload) => {
//   const { gameId, gameName: collectionName, playerId, votes } = data;

//   const actionText = 'submit your word selection votes';
//   firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
//   firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
//   firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
//   firebaseUtils.verifyPayload(votes, 'votes', actionText);

//   // Get 'players' from given game session
//   const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
//   const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

//   // Make player ready and attach drawing
//   const players = playersDoc.data() ?? {};
//   const updatedPlayers = utils.readyPlayer(players, playerId);
//   updatedPlayers[playerId].votes = votes;

//   try {
//     await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
//   } catch (error) {
//     firebaseUtils.throwException(error, actionText);
//   }

//   if (!utils.isEverybodyReady(updatedPlayers)) {
//     return true;
//   }

//   // If all players are ready, trigger next phase
//   return nextUeSoIssoPhase(collectionName, gameId, players);
// };

// export const submitSuggestions = async (data: SubmitSuggestionsPayload) => {
//   const { gameId, gameName: collectionName, playerId, suggestions } = data;

//   const actionText = 'submit your suggestions';
//   firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
//   firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
//   firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
//   firebaseUtils.verifyPayload(suggestions, 'suggestions', actionText);

//   // Get 'players' from given game session
//   const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
//   const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

//   // Make player ready and attach drawing
//   const players = playersDoc.data() ?? {};
//   const updatedPlayers = utils.readyPlayer(players, playerId);
//   updatedPlayers[playerId].suggestions = suggestions;

//   try {
//     await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
//   } catch (error) {
//     firebaseUtils.throwException(error, actionText);
//   }

//   if (!utils.isEverybodyReady(updatedPlayers)) {
//     return true;
//   }
//   // If all players are ready, trigger next phase
//   return nextUeSoIssoPhase(collectionName, gameId, players);
// };

// export const submitValidation = async (data: SubmitSuggestionsValidationPayload) => {
//   const { gameId, gameName: collectionName, playerId, validSuggestions } = data;

//   const actionText = 'submit the suggestions validation';
//   firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
//   firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
//   firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
//   firebaseUtils.verifyPayload(validSuggestions, 'validSuggestions', actionText);

//   // Get 'players' from given game session
//   const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
//   const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

//   // Submit suggestions
//   try {
//     await sessionRef.doc('store').update({ validSuggestions });
//   } catch (error) {
//     firebaseUtils.throwException(error, actionText);
//   }

//   const players = playersDoc.data() ?? {};

//   // If all players are ready, trigger next phase
//   return nextUeSoIssoPhase(collectionName, gameId, players);
// };

// export const sendGuess = async (data: ConfirmGuessPayload) => {
//   const { gameId, gameName: collectionName, playerId, guess } = data;

//   const actionText = 'submit the guess';
//   firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
//   firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
//   firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
//   firebaseUtils.verifyPayload(guess, 'guess', actionText);

//   // Get 'players' from given game session
//   const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);

//   // Submit suggestions
//   try {
//     await sessionRef.doc('state').update({ guess });
//   } catch (error) {
//     firebaseUtils.throwException(error, actionText);
//   }

//   return true;
// };

// export const confirmGuess = async (data: ConfirmGuessPayload) => {
//   const { gameId, gameName: collectionName, playerId, guess } = data;

//   const actionText = 'submit the guess';
//   firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
//   firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
//   firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
//   firebaseUtils.verifyPayload(guess, 'guess', actionText);

//   // Get 'players' from given game session
//   const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
//   const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

//   // Submit suggestions
//   try {
//     await sessionRef.doc('store').update({ guess });
//   } catch (error) {
//     firebaseUtils.throwException(error, actionText);
//   }

//   const players = playersDoc.data() ?? {};

//   // If all players are ready, trigger next phase
//   return nextUeSoIssoPhase(collectionName, gameId, players);
// };
