// Interfaces
import { GameId, PlayerId, GameName } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as playerHandUtils from '../../utils/player-hand-utils';
import { nextDetetivesImaginativosPhase } from './index';
import { HAND_LIMIT } from './constants';

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

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  if (state.currentPlayerId !== playerId) {
    firebaseUtils.throwException('You are not the current player!', 'Failed to play card.');
  }

  const { hand, deckIndex } = playerHandUtils.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);

  await firebaseUtils.updatePlayer({
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
      nextDetetivesImaginativosPhase(collectionName, gameId, players);
    } else {
      await sessionRef.doc('state').update({
        table,
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.phaseOrder[newPhaseIndex],
      });
    }
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to update table with new card');
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

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);

  const state = stateDoc.data() ?? {};

  if (state.currentPlayerId !== playerId) {
    firebaseUtils.throwException('You are not the current player!', 'Failed to play card.');
  }

  // Add card to table
  try {
    const newPhaseIndex = state.phaseIndex + 1;

    // If it is the last player to play, go to the next phase
    if (newPhaseIndex === state.phaseOrder.length) {
      const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
      const players = playersDoc.data() ?? {};
      nextDetetivesImaginativosPhase(collectionName, gameId, players);
    } else {
      await sessionRef.doc('state').update({
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.phaseOrder[newPhaseIndex],
      });
    }
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to conclude your defense');
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
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: nextDetetivesImaginativosPhase,
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
  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', 'submit clue');

  // Submit clue
  try {
    await sessionRef.doc('store').update({ clue });
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to save clue to store');
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextDetetivesImaginativosPhase(collectionName, gameId, players);
};
