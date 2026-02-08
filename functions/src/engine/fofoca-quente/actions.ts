// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

export const handleSubmitPlayersRoles = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  gossiperPlayerId: PlayerId,
  detectivePlayerId: PlayerId,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the gossiper and detective players',
    change: {
      gossiperPlayerId,
      detectivePlayerId,
      [`players.${gossiperPlayerId}.role`]: 'gossiper',
      [`players.${detectivePlayerId}.role`]: 'detective',
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitAssociatedSocialGroup = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  associatedSocialGroupId: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'associated a social group',
    shouldReady: true,
    change: {
      associatedSocialGroupId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitDetectiveLocation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  locationIndex: number,
  shouldReady = false,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'moved the detective',
    change: {
      locationIndexes: utils.firestore.pushValue(locationIndex),
    },
    shouldReady,
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitIntimidation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  intimidatedStudentId: string,
  intimidatedStudentsIds?: string[],
  shouldGoToTheNextPhase = false,
) => {
  const update = intimidatedStudentsIds ? { intimidatedStudentsIds } : {};

  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'intimidated a student',
    change: {
      [`students.${intimidatedStudentId}.intimidated`]: true,
      ...update,
    },
    nextPhaseFunction: shouldGoToTheNextPhase ? getNextPhase : undefined,
  });
};

export const handleSubmitRumor = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  skipRumor: boolean,
  rumoredStudentId?: string,
  rumorIndex?: number,
) => {
  const update: PlainObject = {};

  if (rumoredStudentId && rumorIndex) {
    update.rumoredStudentId = rumoredStudentId;
    update.rumorIndex = rumorIndex;
  } else {
    update.skipRumor = skipRumor;
  }

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'intimidated a student',
    shouldReady: true,
    change: {
      ...update,
    },
    nextPhaseFunction: getNextPhase,
    shouldGoToNextPhase: true,
  });
};
