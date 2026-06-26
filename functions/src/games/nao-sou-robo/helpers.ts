import { orderBy } from 'lodash';
// Types
import type { Captcha, CaptchaCard, FirebaseStoreData, GalleryEntry, Robot } from './types';
// Constants
import {
  BEAT_THRESHOLD,
  CARD_SELECTION_PER_PLAYER_COUNT,
  STARTING_HAND,
  MAX_ROUNDS,
  OUTCOME,
  SUSPICION_THRESHOLD,
  NAO_SOU_ROBO_PHASES,
} from './constants';
// Mechanics
import { getListOfPlayers, getPlayerCount } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Internal
import utils from '../../legacy-utils';
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the round
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: string): string => {
  const { SETUP, CARD_SELECTION, ARE_YOU_A_ROBOT, RESULTS, GAME_OVER } = NAO_SOU_ROBO_PHASES;
  const order = [SETUP, CARD_SELECTION, ARE_YOU_A_ROBOT, RESULTS];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total || outcome !== OUTCOME.CONTINUE
      ? GAME_OVER
      : CARD_SELECTION;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Distributes cards to players' hands from the deck
 * @param store - The Firebase store data
 * @param players - The collection of players in the game
 * @param cards - The array of card IDs to distribute
 */
export const distributeCards = (store: FirebaseStoreData, players: Players, cards: UID[]) => {
  const playerCount = getPlayerCount(players);
  const deckPerPlayer = STARTING_HAND + MAX_ROUNDS * (CARD_SELECTION_PER_PLAYER_COUNT[playerCount] ?? 3);
  // Builds deck per player: starting hand + cards drawn each round
  utils.deck.setup(store, players, cards, deckPerPlayer);
  // Deals the starting hand
  utils.deck.deal(store, players, STARTING_HAND);
};

/**
 * Calculates results by scoring player guesses and tracking robot progress
 * @param players - The collection of players in the game
 * @param robot - The robot state object
 * @param options - The dictionary of captcha card options
 * @param captcha - The current captcha object
 * @param store - The Firebase store data for tracking achievements
 */
export const calculateResults = (
  players: Players,
  robot: Robot,
  options: Dictionary<CaptchaCard>,
  captcha: Captcha,
  store: FirebaseStoreData,
) => {
  // Gained Points: [correct, botVotes]
  const scores = new Scores(players, [0, 0]);
  // Reset robot state
  robot.state = 0;
  // Current outcome
  let outcome = OUTCOME.CONTINUE as string;

  const listOfPlayers = getListOfPlayers(players);

  // Players get 1 point per correct card
  // Players lose 1 point per robot card
  listOfPlayers.forEach((player) => {
    let choseRobot = false;
    players[player.id].suspicion[captcha.round - 1] = false;
    player.guess.forEach((guess) => {
      options[guess].players.push(player.id);

      const isRobot = options[guess].bot;
      if (isRobot) {
        scores.add(player.id, -1, 1);
        increaseAchievement(store.achievements, player.id, 'robot', 1);

        choseRobot = true;
      } else {
        scores.add(player.id, 1, 0);
      }
    });

    player.beat[captcha.round - 1] = !choseRobot;
  });

  // Every selected robot card gets the robot a point (not per player, per card)
  Object.values(options).forEach((option) => {
    if (option.players.length === 1) {
      // Achievement
      increaseAchievement(
        store.achievements,
        option.players[0],
        option.bot ? 'aloneIncorrect' : 'aloneCorrect',
        1,
      );
    }

    if (option.bot) {
      // Achievement
      option.players.forEach((playerId) => {
        increaseAchievement(store.achievements, playerId, 'robot', 1);
        players[playerId].suspicion[captcha.round - 1] = true;
        // If a player has 3 strikes, they lose
        if (players[playerId].suspicion.filter(Boolean).length >= SUSPICION_THRESHOLD) {
          outcome = OUTCOME.TOO_SUSPICIOUS;
        }
      });

      // Robot gets a point if any vote
      const hasVotes = option.players.length > 0;
      robot.points += hasVotes ? 1 : 0;
      robot.state += hasVotes ? 1 : 0;
    }
  });

  // Check if game over
  if (robot.points >= robot.goal) {
    outcome = OUTCOME.ROBOT_WINS;
  }

  // Count
  if (listOfPlayers.some((player) => player.beat.filter(Boolean).length >= BEAT_THRESHOLD)) {
    outcome = OUTCOME.HUMANS_WIN;
  }

  const playersWhoBeatThisRound = listOfPlayers
    .filter((player) => player.beat[captcha.round - 1])
    .map((player) => player.id);

  const maxBeats = Math.max(
    ...listOfPlayers.map((player) => player.beat.reduce((acc: number, e: boolean) => acc + Number(e), 0)),
  );

  const maxSuspicion = Math.max(
    ...listOfPlayers.map((player) =>
      player.suspicion.reduce((acc: number, e: boolean) => acc + Number(e), 0),
    ),
  );

  const result: GalleryEntry = {
    ...captcha,
    options: orderBy(Object.values(options), ['bot', 'players.length'], ['desc', 'desc']),
    outcome,
    beaters: playersWhoBeatThisRound,
    score: maxBeats,
    suspicion: maxSuspicion,
  };

  return {
    ranking: scores.rank(players),
    robot,
    outcome,
    result,
  };
};
