import { shuffle } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type {
  CurrentSuggestions,
  FirebaseStoreData,
  Outcome,
  PastSuggestion,
  PlayerSuggestion,
  UsedWord,
  UsedWords,
} from './types';
// Constants
import { CORRECT_GUESS_SCORE, OUTCOME, UE_SO_ISSO_PHASES } from './constants';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { pushAchievement, increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param group - The group progress object
 * @param currentOutcome - The current outcome of the round
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  group: GroupProgress,
  currentOutcome?: Outcome,
): string => {
  const { SETUP, WORD_SELECTION, SUGGEST, COMPARE, GUESS, VERIFY_GUESS, RESULT, GAME_OVER } =
    UE_SO_ISSO_PHASES;
  const order = [SETUP, WORD_SELECTION, SUGGEST, COMPARE, GUESS, VERIFY_GUESS, RESULT, GAME_OVER];

  if (currentPhase === GUESS && currentOutcome === OUTCOME.PASS) {
    return RESULT;
  }

  if (currentPhase === RESULT) {
    // If there's no way to win
    const roundsLeft = round.total - round.current;
    const possiblePoints = roundsLeft * CORRECT_GUESS_SCORE;
    const pointsToWin = group.goal - group.score;
    if (possiblePoints < pointsToWin) {
      return GAME_OVER;
    }

    return round.forceLastRound ||
      round.current === round.total ||
      group.outcome === OUTCOME.WIN ||
      group.outcome === OUTCOME.LOSE
      ? GAME_OVER
      : WORD_SELECTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds deck of cards with 5 words
 * @param allWords
 * @param numberOfRounds
 */
export const buildDeck = (allWords: TextCardData[], numberOfRounds: number, wordsPerCard) => {
  const shuffledWords = shuffle(allWords);

  const deck: string[] = [];
  for (let i = 0; i < numberOfRounds * wordsPerCard; i += wordsPerCard) {
    const card: TextCardData[] = [];
    for (let j = i; j < i + wordsPerCard; j++) {
      card.push(shuffledWords[j]);
    }

    deck.push(JSON.stringify(card));
  }
  return deck;
};

/**
 * Build word object adding vote property
 * @param currentCard
 * @returns
 */
export const buildCurrentWords = (currentCard: TextCardData[]) => {
  return currentCard.reduce((wordObjects, word) => {
    wordObjects[word.id] = {
      ...word,
      votes: 0,
    };
    return wordObjects;
  }, {});
};

/**
 * Determine the number of suggestions based on the number of Players
 * @param players
 * @returns
 */
export const determineSuggestionsNumber = (players: Players) => {
  const numberOfPlayers = utils.players.getPlayerCount(players);

  if (numberOfPlayers <= 4) return 2;
  return 1;
};

/**
 * Count votes each player gave to each word
 * @param currentWords
 * @param players
 * @returns
 */
export const tallyVotes = (currentWords: UsedWords, players: Players): UsedWords => {
  const currentWordsCopy = { ...currentWords };
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player?.votes) {
      player.votes.forEach((wordId: string) => {
        currentWordsCopy[wordId].votes += 1;
      });
    }
  });

  return currentWordsCopy;
};

/**
 * Determine the secret word by number of votes
 * In case of a tie, a random one from the tied ones
 * @param currentWords
 * @returns
 */
export const determineSecretWord = (currentWords: UsedWords): UsedWord => {
  let mostVotes: UsedWord[] = [];
  const zeroVotes: UsedWord[] = [];
  Object.values(currentWords).forEach((wordObject: UsedWord) => {
    if (wordObject.votes === 0) {
      zeroVotes.push(wordObject);
      return;
    }

    const votesFromMost = mostVotes?.[0]?.votes ?? 1;

    if (votesFromMost < wordObject.votes) {
      mostVotes = [wordObject];
      return;
    }

    if (votesFromMost === wordObject.votes) {
      mostVotes.push(wordObject);
      return;
    }
  });

  return shuffle(mostVotes)[0];
};

/**
 * Group suggestions in each player object into a single object
 * @param players
 * @returns
 */
export const groupSuggestions = (players: Players): CurrentSuggestions => {
  return utils.players.getListOfPlayers(players).reduce((acc: CurrentSuggestions, player: Player) => {
    if (player.suggestions) {
      player.suggestions.forEach((sug: string) => {
        const suggestion = sug.toLowerCase();
        const similarKey =
          Object.keys(acc).find(
            (key) => utils.helpers.stringRemoveAccents(key) === utils.helpers.stringRemoveAccents(suggestion),
          ) ?? suggestion;
        if (acc[similarKey] === undefined) {
          acc[similarKey] = [];
        }
        acc[similarKey].push(player.id);
      });
    }
    return acc;
  }, {});
};

/**
 * Mark suggestions as invalid if they are duplicated
 * @param currentSuggestions
 * @returns
 */
export const validateSuggestions = (currentSuggestions: CurrentSuggestions): PlayerSuggestion[] => {
  return Object.entries(currentSuggestions).reduce((acc: PlayerSuggestion[], suggestionEntry) => {
    const [suggestion, playersSug] = suggestionEntry;

    if (playersSug.length > 1) {
      const res = playersSug.map((playerId) => {
        return {
          suggestion,
          playerId,
          invalid: true,
        };
      });

      res.forEach((item) => {
        acc.push(item);
      });
      return acc;
    }

    acc.push({
      suggestion,
      playerId: playersSug[0],
      invalid: false,
    });

    return acc;
  }, []);
};

/**
 * Finds suggestions that appear more than once in past suggestions
 * @param pastSuggestion - The past suggestion object to check for duplicates
 */
export function findDuplicateSuggestions(pastSuggestion: PastSuggestion): string[] {
  const seenSuggestions = new Set<string>();
  const duplicateSuggestions: string[] = [];

  pastSuggestion.suggestions.forEach((playerSuggestion) => {
    if (playerSuggestion.invalid) {
      if (seenSuggestions.has(playerSuggestion.suggestion)) {
        // suggestion has already been seen, so it's a duplicate
        duplicateSuggestions.push(playerSuggestion.suggestion);
      } else {
        seenSuggestions.add(playerSuggestion.suggestion);
      }
    }
  });

  return duplicateSuggestions;
}

/**
 * Counts achievements from past suggestions for all players
 * @param store - The Firebase store data for tracking achievements
 */
export const countAchievements = (store: FirebaseStoreData) => {
  const pastSuggestions: PastSuggestion[] = store.pastSuggestions;

  pastSuggestions.forEach((entry) => {
    const validClues = entry.suggestions.filter((s) => !s.invalid);
    const invalidClues = entry.suggestions.filter((s) => s.invalid);

    if (entry.outcome === OUTCOME.CORRECT) {
      pushAchievement(store.achievements, entry.guesserId, 'correctGuesses', validClues.length);
    }

    if (entry.outcome === OUTCOME.WRONG) {
      pushAchievement(store.achievements, entry.guesserId, 'wrongGuesses', validClues.length);
    }

    if (entry.outcome === OUTCOME.PASS) {
      increaseAchievement(store.achievements, entry.guesserId, 'passes', 1);
    }

    invalidClues.forEach((clue) => {
      increaseAchievement(store.achievements, clue.playerId, 'eliminatedClues', 1);
      increaseAchievement(store.achievements, clue.playerId, 'clueLength', clue.suggestion.length);
    });

    validClues.forEach((clue) => {
      increaseAchievement(store.achievements, clue.playerId, 'clueLength', clue.suggestion.length);
    });
  });

  // Get mean values
  Object.keys(store.achievements).forEach((playerId) => {
    store.achievements[playerId].correctGuesses = utils.helpers.calculateAverage(
      store.achievements[playerId].correctGuesses ?? [],
    );
    store.achievements[playerId].wrongGuesses = utils.helpers.calculateAverage(
      store.achievements[playerId].wrongGuesses ?? [],
    );
  });
};
