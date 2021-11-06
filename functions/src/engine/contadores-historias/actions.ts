// Interfaces
import { GameId, PlayerId, GameName } from '../../utils/interfaces';
// Constants
import { HAND_LIMIT } from './constants';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as playerHandUtils from '../../utils/player-hand-utils';
// Internal
import { nextContadoresHistoriasPhase } from './index';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handleSubmitStory = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  story: string,
  cardId: string
) => {
  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', 'submit story');

  const players = playersDoc.data() ?? {};

  const { hand, deckIndex } = playerHandUtils.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await firebaseUtils.updatePlayer({
    collectionName,
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
    firebaseUtils.throwException(error, 'Failed to save story to store');
  }

  // If all players are ready, trigger next phase
  return nextContadoresHistoriasPhase(collectionName, gameId, players);
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handlePlayCard = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string
) => {
  const actionText = 'play a card';

  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  if (state.storytellerId === playerId) {
    firebaseUtils.throwException('You are the storyteller!', 'Failed to play card.');
  }

  const { hand, deckIndex } = playerHandUtils.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: {
      hand,
      deckIndex,
      cardId,
    },
    nextPhaseFunction: nextContadoresHistoriasPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitVote = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: nextContadoresHistoriasPhase,
  });
};
