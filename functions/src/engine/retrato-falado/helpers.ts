// Constants
import { RETRATO_FALADO_PHASES } from './constants';
// Types
import type { AllMonsters, MonsterSketch } from './types';
// Helpers
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER } = RETRATO_FALADO_PHASES;
  const order = [RULES, SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : COMPOSITE_SKETCH;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return COMPOSITE_SKETCH;
};

/**
 * Build the deck to be used on the game
 * @param allMonsters
 * @param playerCount
 * @returns
 */
export const buildDeck = (allMonsters: AllMonsters, playerCount: number) => {
  return utils.game.getRandomItems(Object.values(allMonsters), playerCount);
};

/**
 * Builds the sketches array
 * @param players
 * @param currentMonster
 * @returns
 */
export const gatherSketches = (
  players: Players,
  currentMonster: MonsterCard,
  witnessId: PlayerId
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

  return utils.game.shuffle(gathering);
};

/**
 * Score and rank
 * @param players
 * @param witnessId
 * @param mostVotes
 * @param witnessVote
 */
export const buildRanking = (players: Players, witnessId: PlayerId) => {
  // Gained points [Most Voted, votes, witness vote]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  // Count votes
  const votes: Record<PlayerId, PlayerId[]> = {};
  const votesCount = utils.players
    .getListOfPlayers(players)
    .reduce((acc: NumberDictionary, player: Player) => {
      if (player.id !== witnessId) {
        if (acc[player.vote] === undefined) {
          scores.add(player.vote, 1, 1);
          acc[player.vote] = 1;
          votes[player.vote] = [player.id];
        } else {
          acc[player.vote] += 1;
          votes[player.vote].push(player.id);
        }
      }
      return acc;
    }, {});

  const max = Math.max(...Object.values(votesCount));

  const mostVotes = Object.entries(votesCount).reduce(
    (acc: PlayerId[], [playerId, voteCount]: [PlayerId, number]) => {
      if (voteCount === max) acc.push(playerId);
      return acc;
    },
    []
  );
  let mostVoted: PlayerId | null = null;

  // Get witness vote
  const witnessVote = players[witnessId].vote;

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
  mostVotes.forEach((playerId) => {
    scores.add(playerId, 2, 0);
  });

  return {
    ranking: scores.rank(players),
    mostVotes,
    mostVoted,
    witnessVote,
    votes,
  };
};
