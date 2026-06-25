// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Handles story submission for a given card
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the story
 * @param story - The story text
 * @param cardId - The card ID the story is about
 */
export const handleSubmitStory = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  story: string,
  cardId: string,
) => {
  await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit story',
    shouldReady: true,
    change: {
      story,
      cardId,
      vote: cardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles card play submission
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID playing the card
 * @param cardId - The card ID being played
 */
export const handlePlayCard = async (gameName: string, gameId: UID, playerId: UID, cardId: string) => {
  const actionText = 'play a card';

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: {
      cardId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitVote = async (gameName: string, gameId: UID, playerId: UID, vote: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
  });
};
