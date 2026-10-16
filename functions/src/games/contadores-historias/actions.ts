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
 * Records the player's selected table card and marks the player ready.
 * @param gameName - The game identifier used to locate the session
 * @param gameId - The identifier of the game session
 * @param playerId - The identifier of the player submitting or receiving the update
 * @param vote - The identifier of the table card selected by the voter
 * @returns The vote submission result
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
