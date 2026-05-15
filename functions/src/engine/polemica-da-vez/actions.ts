// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';

/**
 * Submits the active player's chosen tweet for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID choosing the tweet
 * @param tweetId - The selected tweet ID
 * @param [customTweet] - Custom tweet text if creating a new tweet
 */
export const handleSubmitTweet = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  tweetId: string,
  customTweet?: string,
) => {
  return await utils.firestore.updateStore({
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
 * Submits each player's reaction and likes guess for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the reaction
 * @param reaction - The player's reaction (boolean)
 * @param likesGuess - The player's guess for number of likes
 */
export const handleSubmitReaction = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  reaction: boolean,
  likesGuess: number,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { reaction, likesGuess },
    nextPhaseFunction: getNextPhase,
  });
};
