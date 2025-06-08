// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitConcepts = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  proposedConcepts: {
    meaning: string;
    itemsIds: CardId[];
    playerId: PlayerId;
    age: number;
    soundId?: string;
    syllable?: DualLanguageValue;
    key?: string;
  }[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your concept',
    shouldReady: true,
    change: { proposedConcepts },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleDownvoteConcepts = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  conceptIds: CardId[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'downvote concepts',
    shouldReady: true,
    change: { downvotedConceptIds: conceptIds },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitName = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  itemId: CardId,
  name: string,
  conceptsIds: CardId[],
) => {
  const proposedName = {
    name,
    itemId,
    conceptsIds,
  };

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit new name',
    shouldReady: true,
    change: { proposedName },
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
