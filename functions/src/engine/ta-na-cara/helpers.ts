import {
  CORRECT_POINTS,
  CUSTOM_QUESTION_ID,
  GUESSED_POINTS,
  MIN_QUESTIONS_PER_ROUND,
  TA_NA_CARA_PHASES,
} from './constants';
import type { FirebaseStoreData, GalleryEntry, TaNaCaraState } from './types';
// Helpers
import utils from '../../utils';
import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';

/**
 * Determine the next phase based on the current one
 * @param state
 * @param store
 * @returns
 */
export const determineNextPhase = (state: TaNaCaraState, playerCount: number): string => {
  const { LOBBY, SETUP, IDENTITY_SELECTION, PROMPTING, ANSWERING, GUESSING, REVEAL, GAME_OVER } =
    TA_NA_CARA_PHASES;
  const order = [LOBBY, SETUP, IDENTITY_SELECTION, PROMPTING, ANSWERING, GUESSING, REVEAL, GAME_OVER];

  const { phase: currentPhase, round } = state;

  if (currentPhase === ANSWERING) {
    const threshold = Math.max(playerCount, MIN_QUESTIONS_PER_ROUND);

    return threshold === state.questionCount ? GUESSING : PROMPTING;
  }

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current) === round.total
      ? GAME_OVER
      : IDENTITY_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return PROMPTING;
};

/**
 * Adds a custom question to the diagnostic data dictionary and returns its generated ID.
 *
 * The function creates a unique ID for the custom question based on a prefix, the author's ID,
 * the current round number, and optionally a trailing number to avoid collisions.
 * If an ID already exists in the dictionary, it increments the trailing number and tries again
 * until a unique ID is found.
 *
 * @param dict - The diagnostic data dictionary to which the question will be added
 * @param authorId - The ID of the player who authored the custom question
 * @param currentRound - The current round number
 * @param customQuestion - The custom question card to be added to the dictionary
 * @returns The unique ID generated for the added question
 */
export const addQuestionToDictionary = (
  dict: Dictionary<TestimonyQuestionCard>,
  authorId: PlayerId,
  currentRound: number,
  customQuestion: TestimonyQuestionCard,
) => {
  let id = '';
  let added = false;
  let trailing = 0;
  while (!added) {
    id = trailing
      ? `${CUSTOM_QUESTION_ID}-${authorId}-${currentRound}-${trailing}`
      : `${CUSTOM_QUESTION_ID}-${authorId}-${currentRound}`;
    if (!dict[id]) {
      dict[id] = customQuestion;
      added = true;
    } else {
      trailing++;
    }
  }

  return id;
};

export function buildGalleryAndRanking(
  players: Players,
  identitiesDict: Dictionary<SuspectCard>,
  store: FirebaseStoreData,
) {
  // Scores [correct answers, guessed identities]
  const scores = new utils.players.Scores(players, [0, 0]);
  const gallery: GalleryEntry[] = [];

  const playersIdentityIds = utils.players.getListOfPlayers(players).reduce((acc: BooleanDictionary, p) => {
    if (p.identity?.identityId) {
      acc[p.identity.identityId] = true;
    }
    return acc;
  }, {});

  utils.players.getListOfPlayers(players).forEach((evaluatingPlayer) => {
    const galleryEntry: GalleryEntry = {
      playerId: evaluatingPlayer.id,
      identityId: evaluatingPlayer.identity.identityId,
      answers: evaluatingPlayer.identity.answers,
      correctPlayersIds: [] as PlayerId[],
      wrongVotes: [],
    };

    const wrongVotes: Record<string, PlayerId[]> = {};

    let correctAnswers = 0;

    // Parse players votes
    utils.players.getListOfPlayers(players).forEach((player) => {
      if (player.id === galleryEntry.playerId) return; // Skip self

      const guess = player.guesses?.[galleryEntry.playerId];
      const isCorrect = guess === galleryEntry.identityId;
      if (isCorrect) {
        galleryEntry.correctPlayersIds.push(player.id);
        scores.add(evaluatingPlayer.id, CORRECT_POINTS, 0);
        correctAnswers++;
      } else {
        if (!wrongVotes[guess]) wrongVotes[guess] = [];
        wrongVotes[guess].push(player.id);

        // When wrong, check for achievements
        if (playersIdentityIds[guess]) {
          // Achievement: Vote for someone else's identity
          utils.achievements.increase(store, player.id, 'voteInOthers', 1);
        }
        // Achievement: Vote for table
        utils.achievements.increase(store, player.id, 'voteForTable', 1);
      }
      // Achievements: Check for suspect features
      const identity = identitiesDict[guess];
      // Adds gender
      utils.achievements.increase(store, player.id, identity.gender, 1);
      // Adds build
      utils.achievements.increase(store, player.id, identity.build, 1);
      // Adds height
      utils.achievements.increase(store, player.id, identity.height, 1);
      // Adds ethnicity
      utils.achievements.increase(store, player.id, identity.ethnicity, 1);
      // Adds young
      if (['18-21'].includes(identity.age)) {
        utils.achievements.increase(store, player.id, 'young', 1);
      }
      // Adds senior
      if (['60-70', '70-80', '80-90'].includes(identity.age)) {
        utils.achievements.increase(store, player.id, 'senior', 1);
      }
    });

    galleryEntry.wrongVotes = Object.entries(wrongVotes).map(([identityId, playerIds]) => ({
      identityId,
      playerIds,
    }));

    // Add evaluated player points
    scores.add(evaluatingPlayer.id, correctAnswers * GUESSED_POINTS, 1);

    gallery.push(galleryEntry);
  });

  return { gallery, ranking: scores.rank(players) };
}
