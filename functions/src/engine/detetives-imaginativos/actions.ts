// Types
import { GameId, PlayerId, GameName } from '../../utils/types';
// Constants
import { HAND_LIMIT } from './constants';
// Utils
import * as utils from '../../utils';
import { getNextPhase } from './index';

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

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  if (state.currentPlayerId !== playerId) {
    utils.firebase.throwException('You are not the current player!', 'Failed to play card.');
  }

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText,
    shouldReady: false,
    change: {
      hand,
      deckIndex,
      cardId,
    },
  });

  // Add card to table
  try {
    const table = state?.table ?? [];
    const playerTableIndex = table.findIndex((i) => i.playerId === playerId);
    if (playerTableIndex === -1) {
      state.table.push({
        playerId,
        cards: [cardId, ''],
      });
    } else {
      state.table[playerTableIndex].cards[1] = cardId;
    }

    const newPhaseIndex = state.phaseIndex + 1;

    // If it is the last player to play, go to the next phase
    if (newPhaseIndex === state.phaseOrder.length) {
      await sessionRef.doc('state').update({ table });
      getNextPhase(collectionName, gameId, players);
    } else {
      await sessionRef.doc('state').update({
        table,
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.phaseOrder[newPhaseIndex],
      });
    }
  } catch (error) {
    utils.firebase.throwException(error, 'Failed to update table with new card');
  }

  return true;
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @returns
 */
export const handleDefend = async (collectionName: GameName, gameId: GameId, playerId: PlayerId) => {
  const actionText = 'defend';

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'state', actionText);

  const state = stateDoc.data() ?? {};

  if (state.currentPlayerId !== playerId) {
    utils.firebase.throwException('You are not the current player!', 'Failed to play card.');
  }

  // Add card to table
  try {
    const newPhaseIndex = state.phaseIndex + 1;

    // If it is the last player to play, go to the next phase
    if (newPhaseIndex === state.phaseOrder.length) {
      const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
      const players = playersDoc.data() ?? {};
      getNextPhase(collectionName, gameId, players);
    } else {
      await sessionRef.doc('state').update({
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.phaseOrder[newPhaseIndex],
      });
    }
  } catch (error) {
    utils.firebase.throwException(error, 'Failed to conclude your defense');
  }

  return true;
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
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param clue
 * @returns
 */
export const handleSubmitClue = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string
) => {
  return await utils.firebase.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit clue',
    change: {
      clue,
    },
    nextPhaseFunction: getNextPhase,
  });
};
