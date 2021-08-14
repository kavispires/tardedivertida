// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { nextUeSoIssoPhase } from '.';

export const handleSubmitWordSelectionVotes = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: PlainObject
) => {
  const actionText = 'submit your word selection votes';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].votes = votes;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextUeSoIssoPhase(collectionName, gameId, players);
  }

  return true;
};

export const handleSubmitSuggestions = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  suggestions: PlainObject
) => {
  const actionText = 'submit your suggestions';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].suggestions = suggestions;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextUeSoIssoPhase(collectionName, gameId, players);
  }

  return true;
};

export const handleSubmitValidation = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  validSuggestions: PlainObject
) => {
  const actionText = 'submit the suggestions validation';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ validSuggestions });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return nextUeSoIssoPhase(collectionName, gameId, players);
};

export const handleConfirmGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  outcome: string
) => {
  const actionText = 'confirm guess';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players = playersDoc.data() ?? {};

  try {
    await sessionRef.doc('store').update({ outcome });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return nextUeSoIssoPhase(collectionName, gameId, players);
};

export const handleUpdateValidSuggestions = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  suggestions: PlainObject
) => {
  const actionText = 'update valid suggestions';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);

  // Updated valid suggestions
  try {
    await sessionRef.doc('state').update({ suggestions });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return true;
};

export const handleSendGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: string
) => {
  const actionText = 'submit the guess';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);

  // Send guess
  try {
    await sessionRef.doc('state').update({ guess });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return true;
};
