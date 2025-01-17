// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCharacters = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  characters: CardId[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your characters',
    shouldReady: true,
    change: { selectedCharacters: utils.game.shuffle(characters) },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGlyphs = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  glyphs: Dictionary<boolean>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your glyphs',
    shouldReady: true,
    change: { selectedGlyphs: glyphs },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: Record<PlayerId, CardId>,
  choseRandomly: boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
