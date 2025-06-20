// Constants
import utils from '../../utils';
import { DETETIVES_IMAGINATIVOS_ACHIEVEMENTS, DETETIVES_IMAGINATIVOS_PHASES } from './constants';
import type { DetetivesImaginativosAchievement, FirebaseStoreData } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (
  currentPhase: (typeof DETETIVES_IMAGINATIVOS_PHASES)[keyof typeof DETETIVES_IMAGINATIVOS_PHASES],
  round: Round,
): string => {
  const { LOBBY, SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER } =
    DETETIVES_IMAGINATIVOS_PHASES;
  const order = [LOBBY, SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : SECRET_CLUE;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return SECRET_CLUE;
};

/**
 * Count impostor votes and assign achievements accordingly.
 */
export const countImpostorVotes = (
  players: Players,
  impostorId: PlayerId,
  store: FirebaseStoreData,
): number =>
  utils.players.getListOfPlayers(players).reduce((total: number, player: Player) => {
    if (!player.vote) {
      return total;
    }
    // Achievement: Defense time
    utils.achievements.increase(store, player.id, 'defenseTime', player.defenseTime || 0);

    if (player.vote === impostorId) {
      // Achievement: 'Vote for the Impostor'
      utils.achievements.increase(store, player.id, 'votedImpostor', 1);
      return total + 1;
    }

    utils.achievements.increase(store, player.id, 'votedInnocent', 1);
    utils.achievements.increase(store, player.vote, 'receivedVotes', 1);

    return total;
  }, 0);

/**
 *
 * @param players
 * @param impostorVotes
 * @param impostorId
 * @param leaderId
 * @returns
 */
export const calculateRanking = (
  players: Players,
  impostorVotes: number,
  impostorId: PlayerId,
  leaderId: PlayerId,
): PlainObject => {
  // Gained points: [player vote, being impostor/leader]
  const scores = new utils.players.Scores(players, [0, 0]);

  const relevantPlayers = [impostorId, leaderId];

  utils.players.getListOfPlayers(players).forEach((player) => {
    // If detectives won
    if (impostorVotes > 1 && !relevantPlayers.includes(player.id)) {
      // If the player voted for the impostor
      if (player.vote === impostorId) {
        scores.add(player.id, 3, 0);
      }
    }
    // If relevant players won
    if (impostorVotes <= 1) {
      if (impostorId === player.id) {
        scores.add(player.id, 5, 1);
      }
      if (leaderId === player.id) {
        scores.add(player.id, 4, 1);
      }
    }
  });

  return scores.rank(players);
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<DetetivesImaginativosAchievement>[] = [];

  const { most: mostLeader } = utils.achievements.getMostAndLeastOf(store, 'artistPoints');
  if (mostLeader) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.MOST_LEADER,
      playerId: mostLeader.playerId,
      value: mostLeader.value,
    });
  }
  const { most: mostImpostor } = utils.achievements.getMostAndLeastOf(store, 'impostorPoints');
  if (mostImpostor) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.MOST_IMPOSTOR,
      playerId: mostImpostor.playerId,
      value: mostImpostor.value,
    });
  }

  const { most: longestClues, least: shortestClues } = utils.achievements.getMostAndLeastOf(
    store,
    'clueLength',
  );
  if (longestClues) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.LONGEST_CLUES,
      playerId: longestClues.playerId,
      value: longestClues.value,
    });
  }
  if (shortestClues) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.SHORTEST_CLUES,
      playerId: shortestClues.playerId,
      value: shortestClues.value,
    });
  }

  const { most: longestDefense, least: shortestDefense } = utils.achievements.getMostAndLeastOf(
    store,
    'defenseTime',
  );
  if (longestDefense) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.LONGEST_DEFENSE,
      playerId: longestDefense.playerId,
      value: longestDefense.value,
    });
  }
  if (shortestDefense) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.SHORTEST_DEFENSE,
      playerId: shortestDefense.playerId,
      value: shortestDefense.value,
    });
  }

  const { most: votedForImpostor } = utils.achievements.getMostAndLeastOf(store, 'votedImpostor');
  if (votedForImpostor) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.VOTED_FOR_IMPOSTOR,
      playerId: votedForImpostor.playerId,
      value: votedForImpostor.value,
    });
  }

  const { most: votedForInnocent } = utils.achievements.getMostAndLeastOf(store, 'votedInnocent');
  if (votedForInnocent) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.VOTED_FOR_INNOCENT,
      playerId: votedForInnocent.playerId,
      value: votedForInnocent.value,
    });
  }

  const { most: receivedVotes } = utils.achievements.getMostAndLeastOf(store, 'receivedVotes');
  if (receivedVotes) {
    achievements.push({
      type: DETETIVES_IMAGINATIVOS_ACHIEVEMENTS.RECEIVED_VOTES,
      playerId: receivedVotes.playerId,
      value: receivedVotes.value,
    });
  }

  return achievements;
};
