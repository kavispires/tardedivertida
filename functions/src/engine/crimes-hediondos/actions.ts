// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCrime = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: PlainObject
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your crime',
    shouldReady: true,
    change: {
      weaponId: data.weaponId,
      evidenceId: data.evidenceId,
      causeOfDeath: data.causeOfDeath,
      reasonForEvidence: data.reasonForEvidence,
      locationTile: data.locationTile,
      locationIndex: data.locationIndex,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitMark = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  sceneId: string,
  sceneIndex: number
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your mark',
    shouldReady: true,
    change: { sceneIndex },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: PlainObject
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};
