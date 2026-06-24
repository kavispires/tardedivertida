import type { GroupQuestionCardData } from '../../types/tdr';
// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import { buildListOfAnswers } from './helpers';
import type { AnswerEntry, AnswerGroupEntry, FirebaseStateData } from './types';
import { throwHttpsError } from '../../services/firebase-core';

/**
 * Submits the active player's chosen question for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID choosing the question
 * @param questionId - The selected question ID
 */
export const handleSubmitQuestion = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  questionId: string,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit question',
    change: {
      questionId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the active player's custom written question for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID writing the question
 * @param customQuestion - The custom question object
 */
export const handleSubmitCustomQuestion = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  customQuestion: GroupQuestionCardData,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit custom question',
    change: {
      customQuestion,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits each player's answers for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting answers
 * @param answers - Dictionary of answer IDs to answer text
 */
export const handleSubmitAnswers = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  answers: Dictionary<string>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { answers },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Advances through answer groups during admin evaluation
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param _playerId - The admin player ID (unused)
 * @param allowedList - Array of allowed answer IDs
 */
export const handleNextAnswers = async (
  gameName: string,
  gameId: UID,
  _playerId: UID,
  allowedList: string[],
) => {
  const actionText = 'advance answers';

  const { sessionRef, state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  const answerGroup = state.answersList[0];
  // Get identical matches first
  let matchingAnswers = answerGroup.entries
    .filter((entry) => entry.parsedAnswer === answerGroup.parsedAnswer)
    .map((entry) => entry.id);
  // Add allowed ones
  matchingAnswers = [...matchingAnswers, ...allowedList];

  // Lock matching answers
  const allAnswers = state.allAnswers.map((answer) => {
    if (matchingAnswers.includes(answer.id)) {
      answer.isLocked = true;
      answer.score = matchingAnswers.length;
    }
    return answer;
  });

  // Removed updated accepted answers
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.answers).forEach((id) => {
      if (matchingAnswers.includes(id)) {
        player.answers[id].isLocked = true;
        player.answers[id].score = matchingAnswers.length;
      }
    });
  });

  // Rebuild answersList without any locked ones
  const answersList = buildListOfAnswers(allAnswers);

  if (answersList.length === 0) {
    return getNextPhase(gameName, gameId, state);
  }

  try {
    await utils.firestore.saveGame(sessionRef, {
      update: {
        state: {
          players,
          allAnswers,
          answersList,
        },
      },
    });
  } catch (error) {
    throwHttpsError(error, actionText);
  }

  return true;
};

/**
 * When player wants to add an answer to the answer group
 * @param gameName
 * @param gameId
 * @param playerId
 * @param answer
 * @returns
 */
export const handleAddAnswer = async (gameName: string, gameId: UID, _playerId: UID, answer: AnswerEntry) => {
  const actionText = 'add answer';

  const { sessionRef, state } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  const answersList = [...(state.answersList as AnswerGroupEntry[])];

  // Only add if player is not in the list already
  if (answersList[0].entries.findIndex((e) => e.playerId === answer.playerId) === -1) {
    answersList[0].entries.push(answer);
  }

  try {
    await sessionRef.doc('state').update({ answersList });
  } catch (error) {
    throwHttpsError(error, actionText);
  }

  return true;
};
