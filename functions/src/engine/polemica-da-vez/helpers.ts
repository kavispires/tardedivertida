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
import type { PlainObject, Players, Round } from '../../utils/types';
import type { Decks, PolemicaDaVezOptions } from './types';
// Utils
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  isGameOver?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, TOPIC_SELECTION, REACT, RESOLUTION, GAME_OVER } = POLEMICA_DA_VEZ_PHASES;
  const order = [RULES, SETUP, TOPIC_SELECTION, REACT, RESOLUTION];

  if (currentPhase === RESOLUTION) {
    return isGameOver || triggerLastRound || (round.current > 0 && round.current === round.total)
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
 * @param allTopics
 * @returns
 */
export const buildDeck = (allTopics): Decks => {
  const { deck, customDeck } = Object.values(allTopics).reduce(
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
export const rankAndScore = (players: Players, totalLikes: number): PlainObject => {
  // Format <player>: [<old score>, <addition points>, <new score>]
  const oneWayValues = [totalLikes - 1, totalLikes + 1];
  // Build score array
  return Object.values(players)
    .map((player) => {
      const previousScore = player.score;
      let gainedPoints = player.likesGuess === totalLikes ? 3 : 0;
      gainedPoints += oneWayValues.includes(player.likesGuess) ? 1 : 0;
      const newScore = player.score + gainedPoints;

      player.score = newScore;
      return {
        playerId: player.id,
        name: player.name,
        previousScore,
        gainedPoints,
        newScore,
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));
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
