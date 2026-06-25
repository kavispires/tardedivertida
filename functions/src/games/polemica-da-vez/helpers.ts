import { sampleSize } from 'lodash';
// Types
import type { CustomTweet, Decks, FirebaseStoreData, PolemicaDaVezOptions } from './types';
// Constants
import { DOUBLE_ROUNDS_THRESHOLD } from '../../constants/general';
import {
  CUSTOM_TOPICS_PER_ROUND,
  MAX_ROUNDS,
  POLEMICA_DA_VEZ_PHASES,
  SCORE_GOAL,
  TOPICS_PER_ROUND,
} from './constants';
// Utils
import utils from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determine the next phase based on the current one
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param isGameOver - Whether the game is over
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, TOPIC_SELECTION, REACT, RESOLUTION, GAME_OVER } = POLEMICA_DA_VEZ_PHASES;
  const order = [SETUP, TOPIC_SELECTION, REACT, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    return isGameOver || round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : TOPIC_SELECTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Build deck and custom deck
 * @param allTweets
 * @returns
 */
export const buildDeck = (allTweets: CustomTweet[]): Decks => {
  const { deck, customDeck } = Object.values(allTweets).reduce(
    (acc: Decks, item) => {
      if (item?.custom) {
        acc.customDeck.push(item);
      } else {
        acc.deck.push(item);
      }

      return acc;
    },
    {
      deck: [],
      customDeck: [],
    },
  );

  return {
    deck: sampleSize(deck, MAX_ROUNDS * TOPICS_PER_ROUND),
    customDeck: sampleSize(customDeck, MAX_ROUNDS * CUSTOM_TOPICS_PER_ROUND),
  };
};

/**
 * Counts total likes across all players and tracks achievements
 * @param players - The collection of players in the game
 * @param store - The Firebase store data for tracking achievements
 */
export const countLikes = (players: Players, store: FirebaseStoreData): number => {
  return utils.players.getListOfPlayers(players).reduce((acc, player) => {
    if (player.reaction) {
      increaseAchievement(store.achievement, player.id, 'likes', 1);
    }
    return player.reaction ? acc + 1 : acc;
  }, 0);
};

/**
 * Creates a ranking, modifies player with new score
 * @param players
 * @param totalLikes
 * @returns
 */
export const getRanking = (players: Players, totalLikes: number, store: FirebaseStoreData) => {
  const scores = new utils.players.Scores(players, [0, 0]);

  const oneOffValues = [totalLikes - 1, totalLikes + 1];

  utils.players.getListOfPlayers(players, true).forEach((player) => {
    if (player.likesGuess === totalLikes) {
      scores.add(player.id, 3, 0);
      increaseAchievement(store.achievement, player.id, 'exactGuesses', 1);
    }

    if (oneOffValues.includes(player.likesGuess)) {
      increaseAchievement(store.achievement, player.id, 'almostGuesses', 1);
      scores.add(player.id, 1, 0);
    }

    increaseAchievement(
      store.achievement,
      player.id,
      'guessDistance',
      Math.abs(player.likesGuess - totalLikes),
    );
  });
  return scores.rank(players);
};

/**
 * Determine if a player has passed the score goal and game should be over
 * @param players - The collection of players in the game
 * @param options - The game configuration options
 * @param round - The round object containing current round information
 */
export const determineGameOver = (players: Players, options: PolemicaDaVezOptions, round: Round) => {
  if (!options.fixedRounds) {
    return utils.players.getListOfPlayers(players).some((player) => player.score >= SCORE_GOAL);
  }

  const playerCount = utils.players.getPlayerCount(players);
  if (playerCount < DOUBLE_ROUNDS_THRESHOLD) {
    return round.current >= playerCount * 2;
  }

  return round.current > playerCount;
};
