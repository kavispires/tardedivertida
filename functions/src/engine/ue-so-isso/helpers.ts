// Types
import type {
  CurrentSuggestions,
  FirebaseStoreData,
  Outcome,
  PastSuggestion,
  PlayerSuggestion,
  UeSoIssoAchievement,
  UsedWord,
  UsedWords,
} from './types';
// Constants
import { CORRECT_GUESS_SCORE, OUTCOME, UE_SO_ISSO_ACHIEVEMENTS, UE_SO_ISSO_PHASES } from './constants';
// Utilities
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param roundsToEndGame
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  group: GroupProgress,
  currentOutcome?: Outcome
): string => {
  const { RULES, SETUP, WORD_SELECTION, SUGGEST, COMPARE, GUESS, VERIFY_GUESS, RESULT, GAME_OVER } =
    UE_SO_ISSO_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, SUGGEST, COMPARE, GUESS, VERIFY_GUESS, RESULT, GAME_OVER];

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

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return WORD_SELECTION;
};

/**
 * Builds deck of cards with 5 words
 * @param allWords
 * @param numberOfRounds
 */
export const buildDeck = (allWords: TextCard[], numberOfRounds: number, wordsPerCard) => {
  const shuffledWords = utils.game.shuffle(allWords);

  const deck: string[] = [];
  for (let i = 0; i < numberOfRounds * wordsPerCard; i += wordsPerCard) {
    const card: TextCard[] = [];
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
export const buildCurrentWords = (currentCard: TextCard[]) => {
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
  Object.values(players).forEach((player) => {
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

  return utils.game.shuffle(mostVotes)[0];
};

/**
 * Group suggestions in each player object into a single object
 * @param players
 * @returns
 */
export const groupSuggestions = (players: Players): CurrentSuggestions => {
  return Object.values(players).reduce((acc: CurrentSuggestions, player: Player) => {
    if (player.suggestions) {
      player.suggestions.forEach((sug: string) => {
        const suggestion = sug.toLowerCase();
        const similarKey =
          Object.keys(acc).find(
            (key) => utils.helpers.stringRemoveAccents(key) === utils.helpers.stringRemoveAccents(suggestion)
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
  return Object.entries(currentSuggestions).reduce((acc: any, suggestionEntry) => {
    const [suggestion, playersSug] = suggestionEntry;

    if (playersSug.length > 1) {
      const res = playersSug.map((playerId) => {
        return {
          suggestion,
          playerId,
          invalid: true,
        };
      });

      return [...acc, ...res];
    }

    acc.push({
      suggestion,
      playerId: playersSug[0],
      invalid: false,
    });

    return acc;
  }, []);
};

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

export function countAchievements(store: FirebaseStoreData) {
  const pastSuggestions: PastSuggestion[] = store.pastSuggestions;

  pastSuggestions.forEach((entry) => {
    const validClues = entry.suggestions.filter((s) => !s.invalid);
    const invalidClues = entry.suggestions.filter((s) => s.invalid);

    if (entry.outcome === OUTCOME.CORRECT) {
      utils.achievements.push(store, entry.guesserId, 'correctGuesses', validClues.length);
    }

    if (entry.outcome === OUTCOME.WRONG) {
      utils.achievements.push(store, entry.guesserId, 'wrongGuesses', validClues.length);
    }

    if (entry.outcome === OUTCOME.PASS) {
      utils.achievements.increase(store, entry.guesserId, 'passes', 1);
    }

    invalidClues.forEach((clue) => {
      utils.achievements.increase(store, clue.playerId, 'eliminatedClues', 1);
      utils.achievements.increase(store, clue.playerId, 'clueLength', clue.suggestion.length);
    });

    validClues.forEach((clue) => {
      utils.achievements.increase(store, clue.playerId, 'clueLength', clue.suggestion.length);
    });
  });

  // Get mean values
  Object.keys(store.achievements).forEach((playerId) => {
    store.achievements[playerId].correctGuesses = utils.game.calculateAverage(
      store.achievements[playerId].correctGuesses ?? []
    );
    store.achievements[playerId].wrongGuesses = utils.game.calculateAverage(
      store.achievements[playerId].wrongGuesses ?? []
    );
  });
}

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<UeSoIssoAchievement>[] = [];

  // Worst Clue Giver: most eliminated clues
  const { most: mostEliminatedClues, least: fewestEliminatedClues } = utils.achievements.getMostAndLeastOf(
    store,
    'eliminatedClues'
  );
  if (mostEliminatedClues) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.MOST_ELIMINATED_CLUES,
      playerId: mostEliminatedClues.playerId,
      value: mostEliminatedClues.value,
    });
  }

  // Best Clue Giver: fewest eliminated clues
  if (fewestEliminatedClues) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.FEWEST_ELIMINATED_CLUES,
      playerId: fewestEliminatedClues.playerId,
      value: fewestEliminatedClues.value,
    });
  }

  // Longest clues:
  const { most: longest, least: shortest } = utils.achievements.getMostAndLeastOf(store, 'clueLength');
  if (longest) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.LONGEST_CLUES,
      playerId: longest.playerId,
      value: longest.value,
    });
  }

  // Shortest clues
  if (shortest) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.SHORTEST_CLUES,
      playerId: shortest.playerId,
      value: shortest.value,
    });
  }

  // Most passes
  const { most: passes } = utils.achievements.getMostAndLeastOf(store, 'passes');
  if (passes) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.MOST_PASSES,
      playerId: passes.playerId,
      value: passes.value,
    });
  }

  // Correct guesses with fewest clues
  const { least: correctGuesses } = utils.achievements.getMostAndLeastOf(
    store,
    'correctGuesses',
    [],
    (v) => v > 0
  );
  if (correctGuesses) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.BEST_GUESSER,
      playerId: correctGuesses.playerId,
      value: correctGuesses.value,
    });
  }

  // Most passes
  const { most: wrongGuesses } = utils.achievements.getMostAndLeastOf(
    store,
    'wrongGuesses',
    [],
    (v) => v > 0
  );
  if (wrongGuesses) {
    achievements.push({
      type: UE_SO_ISSO_ACHIEVEMENTS.WORST_GUESSER,
      playerId: wrongGuesses.playerId,
      value: wrongGuesses.value,
    });
  }

  return achievements;
};
