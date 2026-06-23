// Types
import type { TopicCardData } from '../../types/tdr';
import { orderBy, shuffle } from 'lodash';
import type {
  AnswerEvaluationEntry,
  AnswerGridEntry,
  FirebaseStoreData,
  GroupAnswerEvaluationEntry,
  LetterEntry,
} from './types';
// Constants
import { ADEDANHX_PHASES } from './constants';
import { SEPARATOR } from '../../utils/constants';
// Utils
import utils from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, ANSWERING, EVALUATION, RESULTS, GAME_OVER } = ADEDANHX_PHASES;
  const order = [SETUP, ANSWERING, EVALUATION, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : ANSWERING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds game grid with distributed topics and letters across rounds
 * @param allTopics - All available topics
 * @param allLetters - All available letters
 * @param topicsQuantity - Number of topics per round
 * @param lettersQuantity - Number of letters per round
 * @param roundsCount - Total number of rounds
 * @param allowNSFW - Whether to allow NSFW content
 */
export const buildGrid = (
  allTopics: TopicCardData[],
  allLetters: LetterEntry[],
  topicsQuantity: number,
  lettersQuantity: number,
  roundsCount: number,
  allowNSFW: boolean,
) => {
  const shuffledTopics = shuffle(allTopics).filter((topic) => allowNSFW || !topic.nsfw);
  const easyTopics: TopicCardData[] = [];
  const mediumTopics: TopicCardData[] = [];
  const hardTopics: TopicCardData[] = [];
  const easyTopicsQuantity = topicsQuantity * 2;
  const mediumTopicsQuantity = topicsQuantity * 2;
  const hardTopicsQuantity = topicsQuantity;

  for (let i = 0; i < shuffledTopics.length; i++) {
    // Stop if we have enough topics
    if (
      easyTopics.length === easyTopicsQuantity &&
      mediumTopics.length === mediumTopicsQuantity &&
      hardTopics.length === hardTopicsQuantity
    ) {
      break;
    }

    // Add easy topics
    if (
      easyTopics.length < easyTopicsQuantity &&
      [1, 2].includes(shuffledTopics[i].level) &&
      !easyTopics.some((t) => t.category === shuffledTopics[i].category)
    ) {
      easyTopics.push(shuffledTopics[i]);
      continue;
    }

    // Add medium topics
    if (
      mediumTopics.length < mediumTopicsQuantity &&
      [2, 3, 4].includes(shuffledTopics[i].level) &&
      !mediumTopics.some((t) => t.category === shuffledTopics[i].category)
    ) {
      mediumTopics.push(shuffledTopics[i]);
      continue;
    }

    // Add hard topics
    if (
      hardTopics.length < hardTopicsQuantity &&
      [4, 5].includes(shuffledTopics[i].level) &&
      !hardTopics.some((t) => t.category === shuffledTopics[i].category)
    ) {
      hardTopics.push(shuffledTopics[i]);
    }
  }

  // Distribute topics
  const topics: TopicCardData[] = utils.helpers
    .makeArray(topicsQuantity * roundsCount)
    .map((_, index: number) => {
      const position = index % topicsQuantity;
      let topic: TopicCardData | undefined;
      if (position === 0 || position === 1) {
        topic = easyTopics.pop();
      }
      if (position === 2 || position === 3) {
        topic = mediumTopics.pop();
      }
      if (position === 4) {
        topic = hardTopics.pop();
      }

      if (topic) {
        return topic;
      }
      return shuffledTopics.pop() as TopicCardData;
    });

  // Distribute letters
  const shuffledLetters = shuffle(allLetters);
  const easyLetters: LetterEntry[] = [];
  const mediumLetters: LetterEntry[] = [];
  const hardLetters: LetterEntry[] = [];
  const easyLettersQuantity = lettersQuantity * 2;
  const mediumLettersQuantity = lettersQuantity * 1;
  const hardLettersQuantity = lettersQuantity;

  for (let i = 0; i < shuffledLetters.length; i++) {
    // Stop if we have enough letters
    if (
      easyLetters.length === easyLettersQuantity &&
      mediumLetters.length === mediumLettersQuantity &&
      hardLetters.length === hardLettersQuantity
    ) {
      break;
    }

    // Add easy letters
    if (easyLetters.length < easyLettersQuantity && shuffledLetters[i].level === 1) {
      easyLetters.push(shuffledLetters[i]);
      continue;
    }

    // Add medium letters
    if (mediumLetters.length < mediumLettersQuantity && shuffledLetters[i].level === 2) {
      mediumLetters.push(shuffledLetters[i]);
      continue;
    }

    // Add hard letters
    if (hardLetters.length < hardLettersQuantity && shuffledLetters[i].level === 3) {
      hardLetters.push(shuffledLetters[i]);
    }
  }

  const letters: LetterEntry[] = utils.helpers
    .makeArray(lettersQuantity * roundsCount)
    .map((_, index: number) => {
      const position = index % lettersQuantity;
      let letter: LetterEntry | undefined;
      if (position === 0 || position === 1) {
        letter = easyLetters.pop();
      }
      if (position === 2) {
        letter = mediumLetters.pop();
      }
      if (position === 3) {
        letter = hardLetters.pop();
      }

      if (letter) {
        return letter;
      }
      return shuffledLetters.pop() as LetterEntry;
    });

  return { topics, letters };
};

/**
 * Gets the current grid for the round based on topics and letters
 * @param topics - All available topics
 * @param letters - All available letters
 * @param currentRound - The current round number
 * @param topicsQuantity - Number of topics per round
 * @param lettersQuantity - Number of letters per round
 */
export const getCurrentGrid = (
  topics: TopicCardData[],
  letters: LetterEntry[],
  currentRound: number,
  topicsQuantity: number,
  lettersQuantity: number,
) => {
  const roundIndex = currentRound - 1;
  const startTopicIndex = roundIndex * topicsQuantity;
  const endTopicIndex = startTopicIndex + topicsQuantity;
  const xHeaders = orderBy(topics.slice(startTopicIndex, endTopicIndex), ['level', 'label'], ['asc', 'asc']);

  const startLetters = roundIndex * lettersQuantity;
  const endLetters = startLetters + lettersQuantity;
  const yHeaders = orderBy(letters.slice(startLetters, endLetters), ['level', 'letters'], ['asc', 'asc']);

  return {
    xHeaders,
    yHeaders,
  };
};

/**
 * Groups all player answers by grid cell and prepares them for evaluation
 * @param players - The players object
 * @param topics - Array of topics for the current round
 * @param letters - Array of letters for the current round
 * @param store - The Firebase store data
 */
export const groupAnswers = (
  players: Players,
  topics: TopicCardData[],
  letters: LetterEntry[],
  store: FirebaseStoreData,
) => {
  const result: GroupAnswerEvaluationEntry[] = [];

  topics.forEach((topic, topicIndex) => {
    letters.forEach((letter, letterIndex) => {
      const id = `${topicIndex}-${letterIndex}`;
      const answers: AnswerEvaluationEntry[] = [];
      utils.players.getListOfPlayersIds(players).forEach((playerId) => {
        const [possibleAnswer, timestamp = 0] = (players[playerId].answers[id] ?? '').split(SEPARATOR);

        const answer = possibleAnswer.toLowerCase();

        if (answer) {
          const isAutoRejected = !autoEvaluateAnswer(answer, letter);
          if (isAutoRejected) {
            increaseAchievement(store.achievements, playerId, 'autoReject', 1);
            increaseAchievement(store.achievements, playerId, 'badClues', 1);
          }
          increaseAchievement(store.achievements, playerId, 'cells', 1);

          answers.push({
            id: `${id}${SEPARATOR}${playerId}`,
            playerId,
            answer: answer,
            timestamp: Number(timestamp),
            autoRejected: isAutoRejected,
            rejected: false,
            points: letter.level,
          });
        }
      });

      if (answers.length > 0) {
        result.push({
          id,
          topic,
          letter,
          answers: orderBy(answers, ['timestamp'], ['desc']),
          points: topic.level,
        });
      }
    });
  });

  return result;
};

/**
 * Auto-evaluates an answer against letter entry rules
 * @param answer - The answer to evaluate
 * @param letterEntry - The letter entry with evaluation rules
 */
const autoEvaluateAnswer = (answer: string, letterEntry: LetterEntry): boolean => {
  const { type, letters } = letterEntry;
  const letter = letters.toLowerCase();

  if (answer.length === 1) {
    return false;
  }

  if (type === 'starts-with') {
    const sanitizedAnswer = utils.helpers.stringRemoveAccents(answer);
    return sanitizedAnswer.startsWith(letter);
  }

  if (type === 'ends-with') {
    const sanitizedAnswer = utils.helpers.stringRemoveAccents(answer);
    return sanitizedAnswer.endsWith(letter);
  }

  if (type === 'includes') {
    if (isAccent(letter) || ['˜', '´', 'ˆ'].includes(letter)) {
      // return hasAccent(answer, letter);
      return true;
    }
    return answer.includes(letter);
  }

  return false;
};

/**
 * Checks if a word contains special accent characters
 * @param word - The word to check
 */
function isAccent(word: string): boolean {
  // Define a regular expression to match the accents
  const accentRegex = /[˜ˆ´]/;

  // Use the test() method to check if any of the accents are present in the word
  return accentRegex.test(word);
}

// function hasAccent(word: string, accent: string): boolean {
//   const accentRegex =
//     {
//       '˜': /[ñãõ]/,
//       ˆ: /[âêîôû]/,
//       '´': /[áéíóú]/,
//     }?.[accent] ?? /[˜ˆ´]/;

//   // Use the test() method to check if any of the accents are present in the word
//   return accentRegex.test(word);
// }

/**
 * Evaluates all answers based on player rejections and calculates scores
 * @param players - The players object
 * @param answersGroups - Grouped answers by cell
 * @param store - The Firebase store data
 */
export const evaluateAnswers = (
  players: Players,
  answersGroups: GroupAnswerEvaluationEntry[],
  store: FirebaseStoreData,
) => {
  const rejections: Dictionary<number> = {};
  // Verify rejections and reject any answer that has been rejected by the acceptableRejections value
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.evaluations).forEach((answerId) => {
      if (rejections[answerId] === undefined) {
        rejections[answerId] = 0;
      }
      if (player.evaluations[answerId] === false) {
        rejections[answerId] += 1;
      }

      if (rejections[answerId] >= 2) {
        const [groupId] = answerId.split(SEPARATOR);
        const answersGroup = answersGroups.find((group) => group.id === groupId);
        if (answersGroup) {
          const answer = answersGroup.answers.find((answer) => answer.id === answerId);
          if (answer) {
            answer.rejected = true;
            increaseAchievement(store.achievements, player.id, 'badClues', 1);
          }
        }
      }
    });
  });

  const answersGrid: Record<string, AnswerGridEntry> = {};

  // Gained Points: [answered, 1st answer bonus]
  const scores = new utils.players.Scores(players, [0, 0]);

  answersGroups.forEach((group) => {
    const answerGridEntry: AnswerGridEntry = {
      id: group.id,
      main: {
        playerId: '',
        score: 0,
        answer: '',
      },
      playerIds: [],
      score: 0,
    };
    const topAnswers: AnswerEvaluationEntry[] = [];
    let topTime = 0;
    const otherAnswers: AnswerEvaluationEntry[] = [];
    group.answers.forEach((answer) => {
      if (!answer.rejected && !answer.autoRejected) {
        if (topAnswers.length === 0 || answer.timestamp === topTime) {
          topTime = answer.timestamp;
          topAnswers.push(answer);
        } else {
          otherAnswers.push(answer);
        }
      }
    });

    const topAnswer = topAnswers.length === 1 ? topAnswers[0] : undefined;

    // Skip the whole thing is top answer doesn't exist
    if (topAnswer) {
      const top = topAnswer as AnswerEvaluationEntry;
      answerGridEntry.main.playerId = top.playerId;
      answerGridEntry.main.score = group.topic.level;
      answerGridEntry.main.answer = top.answer;
      scores.add(top.playerId, group.topic.level, 1);
      scores.add(top.playerId, group.letter.level, 0);

      increaseAchievement(store.achievements, top.playerId, 'first', 1);
    }

    otherAnswers.forEach((answer) => {
      answerGridEntry.playerIds.push(answer.playerId);
      scores.add(answer.playerId, group.letter.level, 0);
    });

    if (topAnswer || otherAnswers.length > 0) {
      answerGridEntry.score = group.letter.level;
    }

    if (answerGridEntry.main.playerId) {
      answersGrid[group.id] = answerGridEntry;
    }
  });

  return { answersGrid, ranking: scores.rank(players) };
};

/**
 * Stores gallery data for top answers and cells with no answers
 * @param store - The Firebase store data
 * @param topics - Array of topics
 * @param letters - Array of letters
 * @param answersGrid - Grid of evaluated answers
 */
export const storeGalleryData = (
  store: FirebaseStoreData,
  topics: TopicCardData[],
  letters: LetterEntry[],
  answersGrid: Record<string, AnswerGridEntry>,
) => {
  const { topAnswers, noAnswers } = store;

  topics.forEach((topic, topicIndex) => {
    letters.forEach((letter, letterIndex) => {
      const entryKey = `${topic.id}${SEPARATOR}${letter.letters}`;
      const id = `${topicIndex}-${letterIndex}`;
      const topAnswer = answersGrid?.[id]?.main;
      if (topAnswer) {
        topAnswers.push({
          id: entryKey,
          topic,
          letter,
          topAnswer,
        });
      } else {
        noAnswers.push({
          id: entryKey,
          topic,
          letter,
        });
      }
    });
  });
};
