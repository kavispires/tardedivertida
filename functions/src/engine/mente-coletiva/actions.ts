import type { GroupQuestionCard } from '../../types/tdr';
// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import { buildListOfAnswers } from './helpers';
import type { AnswerEntry, AnswerGroupEntry, FirebaseStateData } from './types';

/**
 * When active player chooses the round's question
 * @param gameName
 * @param gameId
 * @param playerId
 * @param questionId
 * @returns
 */
export const handleSubmitQuestion = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
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
 * When active player writes the round's question
 * @param gameName
 * @param gameId
 * @param playerId
 * @param customQuestion
 * @returns
 */
export const handleSubmitCustomQuestion = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  customQuestion: GroupQuestionCard,
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
 * When each player submit their round's answers
 * @param gameName
 * @param gameId
 * @param playerId
 * @param answers
 * @returns
 */
export const handleSubmitAnswers = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  answers: StringDictionary,
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
 * When admin iterate through answer groups
 * @param gameName
 * @param gameId
 * @param playerId
 * @param allowedList
 * @returns
 */
export const handleNextAnswers = async (
  gameName: GameName,
  gameId: GameId,
  _playerId: PlayerId,
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
    utils.firebase.throwException(error, actionText);
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
export const handleAddAnswer = async (
  gameName: GameName,
  gameId: GameId,
  _playerId: PlayerId,
  answer: AnswerEntry,
) => {
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
    utils.firebase.throwException(error, actionText);
  }

  return true;
};
