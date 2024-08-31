// Constants
import { HAND_LIMIT } from './constants';
// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from './index';
import { FirebaseStateData } from './types';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handleSubmitStory = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  story: string,
  cardId: string
) => {
  // Get 'players' from given game session
  const { sessionRef, state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    'submit story'
  );

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit story',
    shouldReady: false,
    change: {
      hand,
      deckIndex,
      cardId,
    },
  });

  // Submit clue
  try {
    await sessionRef.doc('store').update({ story, solutionCardId: cardId });
  } catch (error) {
    utils.firestore.throwException(error, 'Failed to save story to store');
  }

  // If all players are ready, trigger next phase
  return getNextPhase(gameName, gameId, state);
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handlePlayCard = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string
) => {
  const actionText = 'play a card';
  const { state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText
  );

  if (state.storytellerId === playerId) {
    utils.firestore.throwException('You are the storyteller!', 'Failed to play card.');
  }

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: {
      hand,
      deckIndex,
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
export const handleSubmitVote = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
