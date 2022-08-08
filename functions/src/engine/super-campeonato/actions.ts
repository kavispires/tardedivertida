// Utils
import * as utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * Save player choice between the two challenges
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param challengeId
 * @returns
 */
export const handleSubmitChallenge = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  challengeId: CardId
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your challenge',
    shouldReady: true,
    change: { challengeId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Save player choice of contender for the round
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param contendersId
 * @returns
 */
export const handleSubmitContenders = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  contendersId: CardId
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your contender',
    shouldReady: true,
    change: { selectedContenderId: contendersId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Save player bets for the round
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param quarter
 * @param semi
 * @param final
 * @returns
 */
export const handleSubmitBets = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  quarter: string,
  semi: string,
  final: string
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your contender(s)',
    shouldReady: true,
    change: { 'bets.quarter': quarter, 'bets.semi': semi, 'bets.final': final },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Save player votes for the tier
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param votes
 * @returns
 */
export const handleSubmitVotes = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: NumberDictionary
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
