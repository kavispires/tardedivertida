import {
  BEAT_THRESHOLD,
  CARDS_PER_PLAYER,
  DECK_PER_PLAYER,
  NAO_SOU_ROBO_ACHIEVEMENTS,
  NAO_SOU_ROBO_PHASES,
  OUTCOME,
  SUSPICION_THRESHOLD,
} from './constants';
// Utils
import utils from '../../utils';
import type {
  Captcha,
  CaptchaCard,
  FirebaseStoreData,
  GalleryEntry,
  NaoSouRoboAchievement,
  Robot,
} from './types';
import { orderBy } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: string): string => {
  const { RULES, SETUP, CARD_SELECTION, ARE_YOU_A_ROBOT, RESULTS, GAME_OVER } = NAO_SOU_ROBO_PHASES;
  const order = [RULES, SETUP, CARD_SELECTION, ARE_YOU_A_ROBOT, RESULTS];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total || outcome !== OUTCOME.CONTINUE
      ? GAME_OVER
      : CARD_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return CARD_SELECTION;
};

export const distributeCards = (store: FirebaseStoreData, players: Players, cards: ImageCardId[]) => {
  // Builds a 18 card deck per player
  utils.deck.setup(store, players, cards, DECK_PER_PLAYER);
  // Deals the first 7 cards
  utils.deck.deal(store, players, CARDS_PER_PLAYER - 1);
};

export const calculateResults = (
  players: Players,
  robot: Robot,
  options: Dictionary<CaptchaCard>,
  captcha: Captcha,
  store: FirebaseStoreData,
) => {
  // Gained Points: [correct, botVotes]
  const scores = new utils.players.Scores(players, [0, 0]);
  // Reset robot state
  robot.state = 0;
  // Current outcome
  let outcome = OUTCOME.CONTINUE;

  const listOfPlayers = utils.players.getListOfPlayers(players);

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
        utils.achievements.increase(store, player.id, 'robot', 1);
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
      utils.achievements.increase(
        store,
        option.players[0],
        option.bot ? 'aloneIncorrect' : 'aloneCorrect',
        1,
      );
    }

    if (option.bot) {
      // Achievement
      option.players.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'robot', 1);
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

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<NaoSouRoboAchievement>[] = [];

  // Most and Least Robot: voted for the robot the most/least
  const { most: mostRobot, least: leastRobot } = utils.achievements.getMostAndLeastOf(store, 'robot');
  if (mostRobot) {
    achievements.push({
      type: NAO_SOU_ROBO_ACHIEVEMENTS.MOST_ROBOT,
      playerId: mostRobot.playerId,
      value: mostRobot.value,
    });
  }

  if (leastRobot) {
    achievements.push({
      type: NAO_SOU_ROBO_ACHIEVEMENTS.LEAST_ROBOT,
      playerId: leastRobot.playerId,
      value: leastRobot.value,
    });
  }

  // Most alone incorrect
  const { most: mostAloneRobot } = utils.achievements.getMostAndLeastOf(store, 'aloneIncorrect');
  if (mostAloneRobot) {
    achievements.push({
      type: NAO_SOU_ROBO_ACHIEVEMENTS.MOST_ALONE_ROBOT,
      playerId: mostAloneRobot.playerId,
      value: mostAloneRobot.value,
    });
  }

  // Most alone correct
  const { most: mostAloneCorrect } = utils.achievements.getMostAndLeastOf(store, 'aloneCorrect');
  if (mostAloneCorrect) {
    achievements.push({
      type: NAO_SOU_ROBO_ACHIEVEMENTS.MOST_ALONE_CORRECT,
      playerId: mostAloneCorrect.playerId,
      value: mostAloneCorrect.value,
    });
  }

  return achievements;
};
