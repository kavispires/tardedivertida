// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import { Guesses } from './types';

export const handleSubmitCrime = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: PlainObject
) => {
  return await utils.firebase.updatePlayer({
    gameName,
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  sceneIndex: number
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your mark',
    shouldReady: true,
    change: { sceneIndex },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: Guesses
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};
