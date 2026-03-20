// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCharacters = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  characters: UID[],
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
  gameName: string,
  gameId: UID,
  playerId: UID,
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Record<UID, UID>,
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
