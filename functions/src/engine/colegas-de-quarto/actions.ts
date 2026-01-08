// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitWords = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  words: CardId[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the words',
    shouldReady: true,
    change: { selectedWordsIds: words },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitClues = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clues: string[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clues',
    shouldReady: true,
    change: { clues },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: Record<string, string[]>, // clueEntryId -> things ids[]
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};
