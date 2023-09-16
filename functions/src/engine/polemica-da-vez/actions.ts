// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * When active player chooses the round's tweet
 * @param gameName
 * @param gameId
 * @param playerId
 * @param tweetId
 * @param customTweet
 * @returns
 */
export const handleSubmitTweet = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  tweetId: string,
  customTweet?: string
) => {
  return await utils.firebase.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the question',
    change: {
      tweetId,
      customTweet: customTweet ?? null,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * When each player submit their round's reaction and likes guess
 * @param gameName
 * @param gameId
 * @param playerId
 * @param reaction
 * @param likesGuess
 * @returns
 */
export const handleSubmitReaction = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  reaction: boolean,
  likesGuess: number
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { reaction, likesGuess },
    nextPhaseFunction: getNextPhase,
  });
};
