// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { Guesses } from './types';

export const handleSubmitCrime = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  data: {
    weaponId: string;
    evidenceId: string;
    victimId?: string;
    locationId?: string;
    causeOfDeathIndex: number;
    reasonForEvidenceIndex: number;
    victimIndex: number;
    locationIndex: number;
  },
) => {
  const change: PlainObject = {
    weaponId: data.weaponId,
    evidenceId: data.evidenceId,
    causeOfDeathIndex: data.causeOfDeathIndex,
    reasonForEvidenceIndex: data.reasonForEvidenceIndex,
    locationIndex: data.locationIndex,
    victimIndex: data.victimIndex,
  };

  if (data.victimId) {
    change.victimId = data.victimId;
  }
  if (data.locationId) {
    change.locationId = data.locationId;
  }

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your crime',
    shouldReady: true,
    change,
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitMark = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  sceneIndex: number,
) => {
  return await utils.firestore.updatePlayer({
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
  guesses: Guesses,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};
