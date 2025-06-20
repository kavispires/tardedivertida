// Constants
import { HAND_LIMIT } from './constants';
// Utils
import utils from '../../utils';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';

/**
 *  Submit a clue for the current player.
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clue
 * @returns
 */
export const handleSubmitClue = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit clue',
    change: { clue },
    shouldReady: true,
    shouldGoToNextPhase: true,
    nextPhaseFunction: getNextPhase,
  });
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
  cardId: string,
) => {
  const actionText = 'play a card';

  const { sessionRef, state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  if (state.currentPlayerId !== playerId) {
    utils.firebase.throwException('You are not the current player!', 'Failed to play card.');
  }

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await utils.firestore.updatePlayer({
    gameName,
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
      getNextPhase(gameName, gameId, state);
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

export const handleDefend = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  defenseTime: number,
) => {
  const actionText = 'defend';

  const { sessionRef, state } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  if (state.currentPlayerId !== playerId) {
    utils.firebase.throwException('You are not the current player!', 'Failed to play card.');
  }

  // Add card to table
  try {
    const newPhaseIndex = state.phaseIndex + 1;
    // If it is the last player to play, go to the next phase
    if (newPhaseIndex === state.turnOrder.length) {
      state.players[playerId].defenseTime = defenseTime;
      getNextPhase(gameName, gameId, state);
    } else {
      await sessionRef.doc('state').update({
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.turnOrder[newPhaseIndex],
        [`players.${playerId}.defenseTime`]: defenseTime,
      });
    }
  } catch (error) {
    utils.firebase.throwException(error, 'Failed to conclude your defense');
  }

  return true;
};

export const handleSubmitVote = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId,
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
