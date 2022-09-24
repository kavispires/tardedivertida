// Utils
import * as utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import { buildListOfAnswers } from './helpers';
import { AnswerEntry, AnswerGroupEntry } from './types';

/**
 * When active player chooses the round's question
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param questionId
 * @returns
 */
export const handleSubmitQuestion = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  questionId: string
) => {
  return await utils.firebase.updateStore({
    collectionName,
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
 * When each player submit their round's answers
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param answers
 * @returns
 */
export const handleSubmitAnswers = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  answers: StringDictionary
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { answers },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * When admin iterate through answer groups
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param allowedList
 * @returns
 */
export const handleNextAnswers = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  allowedList: string[]
) => {
  const actionText = 'advance answers';

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'state', actionText);
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
  const state = stateDoc.data() ?? {};
  const players = playersDoc.data() ?? {};

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
  Object.values(players).forEach((player) => {
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
    return getNextPhase(collectionName, gameId, players);
  }

  try {
    await utils.firebase.saveGame(sessionRef, {
      update: {
        state: {
          allAnswers,
          answersList,
        },
      },
      set: {
        players,
      },
    });
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }

  return true;
};

/**
 * When player wants to add an answer to the answer group
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param answer
 * @returns
 */
export const handleAddAnswer = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  answer: AnswerEntry
) => {
  const actionText = 'add answer';

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);

  const stateDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'state', actionText);
  const state = stateDoc.data() ?? {};

  const answersList = [...(state.answersList as AnswerGroupEntry[])];

  // Only add if player is not in the list already
  if (answersList[0].entries.findIndex((e) => e.playerId === answer.playerId) === -1) {
    answersList[0].entries.push(answer);
  }

  try {
    await sessionRef.doc('state').update({ answersList });
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }

  return true;
};
