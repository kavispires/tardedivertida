import { arrayUnion } from 'firebase/firestore';
// Helpers
import utils from '../../utils';
// Internal functions
// import { getNextPhase } from './index';

// TODO: Choose room action
// TODO: Reset action (for tutorial)

export const handleSubmitBets = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: CardId,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit play card',
    change: { played: arrayUnion(cardId) },
    // nextPhaseFunction: getNextPhase,
  });
};
