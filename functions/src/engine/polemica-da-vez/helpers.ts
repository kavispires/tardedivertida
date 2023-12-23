// Constants
import {
  CUSTOM_TOPICS_PER_ROUND,
  MAX_ROUNDS,
  POLEMICA_DA_VEZ_ACHIEVEMENTS,
  POLEMICA_DA_VEZ_PHASES,
  SCORE_GOAL,
  TOPICS_PER_ROUND,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Types
import type { Decks, FirebaseStoreData, PolemicaDaVezAchievement, PolemicaDaVezOptions } from './types';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { RULES, SETUP, TOPIC_SELECTION, REACT, RESOLUTION, GAME_OVER } = POLEMICA_DA_VEZ_PHASES;
  const order = [RULES, SETUP, TOPIC_SELECTION, REACT, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    return isGameOver || round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : TOPIC_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return TOPIC_SELECTION;
};

/**
 * Build deck and custom deck
 * @param allTweets
 * @returns
 */
export const buildDeck = (allTweets): Decks => {
  const { deck, customDeck } = Object.values(allTweets).reduce(
    (acc: Decks, item: any) => {
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
    }
  );

  return {
    deck: utils.game.getRandomItems(deck, MAX_ROUNDS * TOPICS_PER_ROUND),
    customDeck: utils.game.getRandomItems(customDeck, MAX_ROUNDS * CUSTOM_TOPICS_PER_ROUND),
  };
};

export const countLikes = (players: Players, store: FirebaseStoreData): number => {
  return utils.players.getListOfPlayers(players).reduce((acc, player) => {
    if (player.reaction) {
      utils.achievements.increase(store, player.id, 'likes', 1);
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
      utils.achievements.increase(store, player.id, 'exactGuesses', 1);
    }

    if (oneOffValues.includes(player.likesGuess)) {
      utils.achievements.increase(store, player.id, 'almostGuesses', 1);
      scores.add(player.id, 1, 0);
    }

    utils.achievements.increase(store, player.id, 'guessDistance', Math.abs(player.likesGuess - totalLikes));
  });
  return scores.rank(players);
};

/**
 * Determine if a player has passed level 4 and it should be game over
 * @param players
 * @returns
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<PolemicaDaVezAchievement>[] = [];

  const { most: liker, least: hater } = utils.achievements.getMostAndLeastOf(store, 'likes');

  if (liker) {
    achievements.push({
      type: POLEMICA_DA_VEZ_ACHIEVEMENTS.MOST_LIKER,
      ...liker,
    });
  }

  if (hater) {
    achievements.push({
      type: POLEMICA_DA_VEZ_ACHIEVEMENTS.BIGGEST_HATER,
      ...hater,
    });
  }

  const { most: bestGuess, least: worstGuess } = utils.achievements.getMostAndLeastOf(store, 'guessDistance');

  if (bestGuess) {
    achievements.push({
      type: POLEMICA_DA_VEZ_ACHIEVEMENTS.BEST_GUESSES,
      ...bestGuess,
    });
  }

  if (worstGuess) {
    achievements.push({
      type: POLEMICA_DA_VEZ_ACHIEVEMENTS.WORST_GUESSES,
      ...worstGuess,
    });
  }

  const { most: mostOneOffs } = utils.achievements.getMostAndLeastOf(store, 'almostGuesses');

  if (mostOneOffs) {
    achievements.push({
      type: POLEMICA_DA_VEZ_ACHIEVEMENTS.MOST_ONE_OFFS,
      ...mostOneOffs,
    });
  }

  const { most: mostExacts } = utils.achievements.getMostAndLeastOf(store, 'exactGuesses');

  if (mostExacts) {
    achievements.push({
      type: POLEMICA_DA_VEZ_ACHIEVEMENTS.MOST_EXACTS,
      ...mostExacts,
    });
  }

  return achievements;
};
