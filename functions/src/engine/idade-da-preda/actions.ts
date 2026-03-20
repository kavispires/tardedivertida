// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitConcepts = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  proposedConcepts: {
    meaning: string;
    itemsIds: UID[];
    playerId: UID;
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  conceptIds: UID[],
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
  gameName: string,
  gameId: UID,
  playerId: UID,
  itemId: UID,
  name: string,
  conceptsIds: UID[],
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
