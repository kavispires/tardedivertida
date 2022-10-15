// Constants
import { HAND_LIMIT } from './constants';
// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from './index';

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
  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', 'submit story');

  const players = playersDoc.data() ?? {};

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await utils.firebase.updatePlayer({
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
    utils.firebase.throwException(error, 'Failed to save story to store');
  }

  // If all players are ready, trigger next phase
  return getNextPhase(gameName, gameId, players);
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

  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', actionText);
  const stateDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  if (state.storytellerId === playerId) {
    utils.firebase.throwException('You are the storyteller!', 'Failed to play card.');
  }

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  return await utils.firebase.updatePlayer({
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
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
