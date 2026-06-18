// Constants
import { RETRATO_FALADO_PHASES } from './constants';
import { sampleSize, shuffle } from 'lodash';
// Types
import type { MonsterImage } from '../../types/tdr';
import type { AllMonsters, FirebaseStoreData, MonsterSketch } from './types';
// Helpers
import utils from '../../utils';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER } = RETRATO_FALADO_PHASES;
  const order = [SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : COMPOSITE_SKETCH;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Build the deck to be used in the game
 * @param allMonsters - The dictionary of all monster images
 * @param playerCount - The number of players in the game
 */
export const buildDeck = (allMonsters: AllMonsters, playerCount: number) => {
  return sampleSize(Object.values(allMonsters), playerCount);
};

/**
 * Gathers all sketches from players except the witness
 * @param players - The collection of players in the game
 * @param currentMonster - The current monster being sketched
 * @param witnessId - The ID of the witness player
 */
export const gatherSketches = (
  players: Players,
  currentMonster: MonsterImage,
  witnessId: UID,
): MonsterSketch[] => {
  const gathering = utils.players.getListOfPlayers(players).reduce((acc: MonsterSketch[], player: Player) => {
    if (player.id !== witnessId) {
      acc.push({
        playerId: player.id,
        sketch: player.sketch,
        id: currentMonster.id,
        orientation: currentMonster.orientation,
      });
    }
    return acc;
  }, []);

  return shuffle(gathering);
};

/**
 * Scores sketches and builds player rankings based on votes
 * @param players - The collection of players in the game
 * @param witnessId - The ID of the witness player
 * @param store - The Firebase store data for tracking achievements
 */
export const buildRanking = (players: Players, witnessId: UID, store: FirebaseStoreData) => {
  // Gained points [Most Voted, votes, witness vote]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  // Count votes
  const votes: Record<UID, UID[]> = {};
  const votesCount = utils.players
    .getListOfPlayers(players)
    .reduce((acc: Dictionary<number>, player: Player) => {
      if (player.id !== witnessId) {
        if (acc[player.vote] === undefined) {
          scores.add(player.vote, 1, 1);
          utils.achievements.increase(store, player.vote, 'votes', 1);
          acc[player.vote] = 1;
          votes[player.vote] = [player.id];
          utils.achievements.increase(store, player.vote, 'votes', 1);
        } else {
          acc[player.vote] += 1;
          votes[player.vote].push(player.id);
        }
      }
      return acc;
    }, {});

  const max = Math.max(...Object.values(votesCount));

  const mostVotes = Object.entries(votesCount).reduce((acc: UID[], [playerId, voteCount]: [UID, number]) => {
    if (voteCount === max) acc.push(playerId);
    return acc;
  }, []);
  let mostVoted: UID | null = null;

  // Achievement: Group votes
  utils.players.getListOfPlayers(players).forEach((player: Player) => {
    if (mostVotes.includes(player.vote)) {
      utils.achievements.increase(store, player.vote, 'groupVote', 1);
    }
  });

  // Get witness vote
  const witnessVote = players[witnessId].vote;
  utils.achievements.increase(store, witnessVote, 'witnessPick', 1);

  // In case of a tie, the witness vote is the tie breaker
  if (mostVotes.length > 1) {
    const witnessVoteIndex = mostVotes.indexOf(witnessVote);
    if (witnessVoteIndex > -1) {
      // Witness point bc their vote was among the most voted
      mostVoted = mostVotes[witnessVoteIndex];
      scores.add(witnessId, 2, 1);
    }
  } else {
    mostVoted = mostVotes[0];
    if (mostVoted === witnessVote) {
      scores.add(witnessId, 2, 1);
    }
  }

  // Add points for mostVotes
  if (mostVoted) {
    scores.add(mostVoted, 3, 0);
    scores.subtract(mostVoted, 1, 1);
  } else {
    mostVotes.forEach((playerId) => {
      scores.add(playerId, 3, 0);
      scores.subtract(playerId, 1, 1);
    });
  }

  return {
    ranking: scores.rank(players),
    mostVotes,
    mostVoted,
    witnessVote,
    votes,
  };
};
