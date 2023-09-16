// Constants
import {
  CUSTOM_TOPICS_PER_ROUND,
  MAX_ROUNDS,
  POLEMICA_DA_VEZ_PHASES,
  SCORE_GOAL,
  TOPICS_PER_ROUND,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Types
import type { Decks, PolemicaDaVezOptions } from './types';
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

export const countLikes = (players: Players): number => {
  return Object.values(players).reduce((acc, player) => {
    return player.reaction ? acc + 1 : acc;
  }, 0);
};

/**
 * Creates a ranking, modifies player with new score
 * @param players
 * @param totalLikes
 * @returns
 */
export const getRanking = (players: Players, totalLikes: number) => {
  const scores = new utils.players.Scores(players, [0]);

  const oneOffValues = [totalLikes - 1, totalLikes + 1];

  utils.players.getListOfPlayers(players, true).forEach((player) => {
    scores.add(player.id, player.likesGuess === totalLikes ? 3 : 0, 0);
    scores.add(player.id, oneOffValues.includes(player.likesGuess) ? 1 : 0, 0);
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
    return Object.values(players).some((player) => player.score >= SCORE_GOAL);
  }

  const playerCount = utils.players.getPlayerCount(players);
  if (playerCount < DOUBLE_ROUNDS_THRESHOLD) {
    return round.current >= playerCount * 2;
  }

  return round.current > playerCount;
};
