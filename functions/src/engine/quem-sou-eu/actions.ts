// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitCharacters = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  characters: CardId[]
) => {
  return await utils.firebase.updatePlayer({
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
  glyphs: Record<CardId, boolean>
) => {
  return await utils.firebase.updatePlayer({
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
  guesses: Record<PlayerId, CardId>
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};