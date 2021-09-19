// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/interfaces';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { nextInstrumentosCodificadosPhase } from './index';

export const handleSubmitHint = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  hint: string,
  targetId: PlayerId,
  position: number
) => {
  const actionText = 'submit hint';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);

  updatedPlayers[playerId].currentHint = {
    targetId,
    hint,
    position,
  };

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextInstrumentosCodificadosPhase(collectionName, gameId, players);
  }

  return true;
};

export const handleSubmitConclusions = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  conclusions: PlainObject
) => {
  const actionText = 'submit conclusions';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);

  updatedPlayers[playerId].conclusions = {
    ...updatedPlayers[playerId].conclusions,
    ...conclusions,
  };

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextInstrumentosCodificadosPhase(collectionName, gameId, players);
  }

  return true;
};

export const handleSubmitCode = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  code: string
) => {
  const actionText = 'submit conclusions';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);

  updatedPlayers[playerId].codeGuess = code;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextInstrumentosCodificadosPhase(collectionName, gameId, players);
  }

  return true;
};
