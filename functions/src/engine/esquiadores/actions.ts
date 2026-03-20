// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitChoices = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  choices: string[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    change: { choices },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitBets = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  bets: Dictionary<number>,
  betType: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your bets',
    shouldReady: true,
    change: { [betType]: bets },
    nextPhaseFunction: getNextPhase,
  });
};
