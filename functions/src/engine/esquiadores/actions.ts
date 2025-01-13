// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitChoices = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  bets: NumberDictionary,
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
