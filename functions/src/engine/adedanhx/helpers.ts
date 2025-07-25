// Types
import type { TopicCard } from '../../types/tdr';
import type {
  AdedanhxAchievement,
  AnswerEvaluationEntry,
  AnswerGridEntry,
  FirebaseStoreData,
  GroupAnswerEvaluationEntry,
  LetterEntry,
} from './types';
// Constants
import { ADEDANHX_ACHIEVEMENTS, ADEDANHX_PHASES } from './constants';
import { SEPARATOR } from '../../utils/constants';
// Utils
import utils from '../../utils';
import { orderBy } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, ANSWERING, EVALUATION, RESULTS, GAME_OVER } = ADEDANHX_PHASES;
  const order = [LOBBY, SETUP, ANSWERING, EVALUATION, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : ANSWERING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return ANSWERING;
};

export const buildGrid = (
  allTopics: TopicCard[],
  allLetters: LetterEntry[],
  topicsQuantity: number,
  lettersQuantity: number,
  roundsCount: number,
  allowNSFW: boolean,
) => {
  const shuffledTopics = utils.game.shuffle(allTopics).filter((topic) => allowNSFW || !topic.nsfw);
  const easyTopics: TopicCard[] = [];
  const mediumTopics: TopicCard[] = [];
  const hardTopics: TopicCard[] = [];
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
  const topics: TopicCard[] = utils.game.makeArray(topicsQuantity * roundsCount).map((_, index: number) => {
    const position = index % topicsQuantity;
    let topic: TopicCard | undefined;
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
    return shuffledTopics.pop() as TopicCard;
  });

  // Distribute letters
  const shuffledLetters = utils.game.shuffle(allLetters);
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

  const letters: LetterEntry[] = utils.game
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

export const getCurrentGrid = (
  topics: TopicCard[],
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

export const groupAnswers = (
  players: Players,
  topics: TopicCard[],
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
            // Achievement: autoReject
            utils.achievements.increase(store, playerId, 'autoReject', 1);
            // Achievement: badClues
            utils.achievements.increase(store, playerId, 'badClues', 1);
          }
          // Achievement: cells
          utils.achievements.increase(store, playerId, 'cells', 1);

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

export const evaluateAnswers = (
  players: Players,
  answersGroups: GroupAnswerEvaluationEntry[],
  store: FirebaseStoreData,
) => {
  const playerCount = utils.players.getPlayerCount(players);
  const acceptableRejections = playerCount > 4 ? 2 : 1;

  const rejections: NumberDictionary = {};
  // Verify rejections and reject any answer that has been rejected by the acceptableRejections value
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.keys(player.evaluations).forEach((answerId) => {
      if (rejections[answerId] === undefined) {
        rejections[answerId] = 0;
      }
      if (player.evaluations[answerId]) {
        rejections[answerId] += 1;
      }

      if (rejections[answerId] >= acceptableRejections) {
        const [groupId] = answerId.split(SEPARATOR);
        const answersGroup = answersGroups.find((group) => group.id === groupId);
        if (answersGroup) {
          const answer = answersGroup.answers.find((answer) => answer.id === answerId);
          if (answer) {
            answer.rejected = true;
            // Achievement: badClues
            utils.achievements.increase(store, player.id, 'badClues', 1);
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
      // Achievement: top answer/first
      utils.achievements.increase(store, top.playerId, 'first', 1);
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

export const storeGalleryData = (
  store: FirebaseStoreData,
  topics: TopicCard[],
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<AdedanhxAchievement>[] = [];

  // Most Stops: stopped the game the most
  const { most: mostStops } = utils.achievements.getMostAndLeastOf(store, 'stop');
  if (mostStops) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.MOST_STOPS,
      playerId: mostStops.playerId,
      value: mostStops.value,
    });
  }

  // Never stopped
  const neverStopped = utils.achievements.getOnlyExactMatch(store, 'stop', 0);

  if (neverStopped) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.NEVER_STOPPED,
      playerId: neverStopped.playerId,
      value: neverStopped.value,
    });
  }

  // Most first answers
  const { most: mostFirstAnswers, least: fewestFirstAnswers } = utils.achievements.getMostAndLeastOf(
    store,
    'first',
  );

  if (mostFirstAnswers) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.MOST_FIRST_ANSWERS,
      playerId: mostFirstAnswers.playerId,
      value: mostFirstAnswers.value,
    });
  }

  // Fewest first answers
  if (fewestFirstAnswers) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.LEAST_FIRST_ANSWERS,
      playerId: fewestFirstAnswers.playerId,
      value: fewestFirstAnswers.value,
    });
  }

  // Most cells: answered the most
  const { most: mostCells, least: fewestCells } = utils.achievements.getMostAndLeastOf(store, 'cells');
  if (mostCells) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.MOST_CELLS,
      playerId: mostCells.playerId,
      value: mostCells.value,
    });
  }

  // Fewest cells: answered the least
  if (fewestCells) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.FEWEST_CELLS,
      playerId: fewestCells.playerId,
      value: fewestCells.value,
    });
  }

  // Most auto rejects: auto rejected the most
  const { most: mostAutoRejects } = utils.achievements.getMostAndLeastOf(store, 'autoReject');
  if (mostAutoRejects) {
    achievements.push({
      type: ADEDANHX_ACHIEVEMENTS.MOST_AUTO_REJECTS,
      playerId: mostAutoRejects.playerId,
      value: mostAutoRejects.value,
    });
  }

  return achievements;
};
