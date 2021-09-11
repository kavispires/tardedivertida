// Constants
import {
  CUSTOM_TOPICS_PER_ROUND,
  MAX_NUMBER_OF_ROUNDS,
  POLEMICA_DA_VEZ_PHASES,
  SCORE_GOAL,
  TOPICS_PER_ROUND,
} from './constants';
// Interfaces
import { PlainObject, Players } from '../../utils/interfaces';
import { Decks } from './interfaces';
// Utils
import * as gameUtils from '../../utils/game-utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  isGameOver?: boolean
): string => {
  const { RULES, SETUP, TOPIC_SELECTION, REACT, RESOLUTION, GAME_OVER } = POLEMICA_DA_VEZ_PHASES;
  const order = [RULES, SETUP, TOPIC_SELECTION, REACT, RESOLUTION];

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION && currentRound === MAX_NUMBER_OF_ROUNDS) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    return TOPIC_SELECTION;
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
    deck: gameUtils.getRandomItems(deck, MAX_NUMBER_OF_ROUNDS * TOPICS_PER_ROUND),
    customDeck: gameUtils.getRandomItems(customDeck, MAX_NUMBER_OF_ROUNDS * CUSTOM_TOPICS_PER_ROUND),
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
  // Build score array
  return Object.values(players)
    .map((player) => {
      const previousScore = player.score;
      const gainedPoints = player.likesGuess === totalLikes ? 1 : 0;
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
export const determineGameOver = (players: Players) => {
  return Object.values(players).some((player) => player.score >= SCORE_GOAL);
};
