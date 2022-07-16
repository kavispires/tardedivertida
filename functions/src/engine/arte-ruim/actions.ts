// Types
import type { GameId, PlayerId, GameName, PlainObject } from '../../utils/types';
// Helpers
import * as utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitDrawing = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  drawing: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your drawing',
    shouldReady: true,
    change: { 'currentCard.drawing': drawing },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitVoting = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: PlainObject
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};
