import { arrayUnion } from 'firebase/firestore';
// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCard = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: CardId,
) => {
  // TODO: check if it's help or complete mission card and then use getNextPhase accordingly, cards Ids should be UIDs for those
  const isHelpCard = false; // Replace with actual check
  const isCompleteMissionCard = false; // Replace with actual check

  const shouldAdvancePhase = isHelpCard || isCompleteMissionCard;

  // If the played card is a help or complete mission card, we might want to trigger phase advancement
  const nextPhaseFunction = shouldAdvancePhase ? getNextPhase : undefined;

  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit play card',
    change: { played: arrayUnion(cardId) },
    nextPhaseFunction,
  });
};
