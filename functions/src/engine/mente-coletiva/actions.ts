// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { nextMenteColetivaPhase } from '.';
import { buildListOfAnswers } from './helpers';

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
  return await firebaseUtils.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit question',
    change: {
      questionId,
    },
    nextPhaseFunction: nextMenteColetivaPhase,
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
  answers: PlainObject
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit the answers',
    shouldReady: true,
    change: { answers },
    nextPhaseFunction: nextMenteColetivaPhase,
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

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
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
    return nextMenteColetivaPhase(collectionName, gameId, players);
  }

  try {
    await firebaseUtils.saveGame(sessionRef, {
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
    firebaseUtils.throwException(error, actionText);
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
  answer: PlainObject
) => {
  const actionText = 'advance answers';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);

  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const state = stateDoc.data() ?? {};

  const answersList = [...state.answersList];
  answersList[0].entries.push(answer);

  try {
    await sessionRef.doc('state').update({ answersList });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return true;
};
