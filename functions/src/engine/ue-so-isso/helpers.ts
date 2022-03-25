// Types
import { PlainObject, Player, Players } from '../../utils/types';
import { AllWords, CurrentSuggestions, UsedWord, UsedWords, Word } from './types';
// Constants
import { UE_SO_ISSO_PHASES, WORDS_PER_CARD } from './constants';
// Utilities
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param roundsToEndGame
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  roundsToEndGame: number,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, WORD_SELECTION, SUGGEST, COMPARE, GUESS, GAME_OVER } = UE_SO_ISSO_PHASES;
  const order = [RULES, SETUP, WORD_SELECTION, SUGGEST, COMPARE, GUESS, GAME_OVER];

  if (currentPhase === GUESS) {
    return triggerLastRound || roundsToEndGame <= 0 ? GAME_OVER : WORD_SELECTION;
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
export const buildDeck = (allWords: AllWords, numberOfRounds: number) => {
  const shuffledWords = utils.game.shuffle(Object.values(allWords));
  const deck: string[] = [];
  for (let i = 0; i < numberOfRounds * WORDS_PER_CARD; i += WORDS_PER_CARD) {
    const card: Word[] = [];
    for (let j = i; j < i + WORDS_PER_CARD; j++) {
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
export const buildCurrentWords = (currentCard: Word[]) => {
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
  const numberOfPlayers = Object.keys(players).length;

  if (numberOfPlayers <= 3) return 3;
  if (numberOfPlayers <= 4) return 2;
  return 1;
};

/**
 * Determine score based on the guess value
 * @param guess
 * @returns
 */
export const determineScore = (guess: string): number => {
  if (guess === 'CORRECT') return 3;
  if (guess === 'WRONG') return -1;
  return 0;
};

/**
 * Determine the group current score
 * @param players
 * @param totalRounds
 * @returns
 */
export const determineGroupScore = (players: Players, totalRounds: number): number => {
  const expectedPoints = totalRounds * 3;
  const totalPoints = Object.values(players).reduce((acc: number, player: Player) => {
    acc += player.score;
    return acc;
  }, 0);

  return Math.round((100 * totalPoints) / expectedPoints);
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
      player.suggestions.forEach((suggestion: string) => {
        if (acc[suggestion] === undefined) {
          acc[suggestion] = [];
        }
        acc[suggestion].push(player.id);
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
export const validateSuggestions = (currentSuggestions: CurrentSuggestions): PlainObject[] => {
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
