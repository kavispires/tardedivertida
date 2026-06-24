// Constants
import { HAND_LIMIT } from './constants';
// Utils
import { getStateReferences, updatePlayer } from '../../services/game-session';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';
import { throwHttpsError } from '../../services/firebase-core';
import utils from '../../utils';

/**
 * Submits a clue for the current player
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the clue
 * @param clue - The clue text
 */
export const handleSubmitClue = async (gameName: string, gameId: UID, playerId: UID, clue: string) => {
  return await updatePlayer({
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
 * Handles card play submission
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID playing the card
 * @param cardId - The card ID being played
 */
export const handlePlayCard = async (gameName: string, gameId: UID, playerId: UID, cardId: string) => {
  const actionText = 'play a card';

  const { sessionRef, state, players } = await getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  if (state.currentPlayerId !== playerId) {
    throwHttpsError('You are not the current player!', 'Failed to play card.');
  }

  const { hand, deckIndex } = utils.playerHand.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await updatePlayer({
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
    throwHttpsError(error, 'Failed to update table with new card');
  }

  return true;
};

export const handleDefend = async (gameName: string, gameId: UID, playerId: UID, defenseTime: number) => {
  const actionText = 'defend';

  const { sessionRef, state } = await getStateReferences<FirebaseStateData>(gameName, gameId, actionText);

  if (state.currentPlayerId !== playerId) {
    throwHttpsError('You are not the current player!', 'Failed to play card.');
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
    throwHttpsError(error, 'Failed to conclude your defense');
  }

  return true;
};

export const handleSubmitVote = async (gameName: string, gameId: UID, playerId: UID, vote: UID) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
