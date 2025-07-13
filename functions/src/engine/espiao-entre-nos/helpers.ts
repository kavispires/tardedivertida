// Constants
import { ESPIAO_ENTRE_NOS_PHASES, GAME_DURATION, OUTCOMES, SPY } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Outcome } from './types';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param outcome
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: Outcome): string => {
  const { LOBBY, SETUP, ASSIGNMENT, INVESTIGATION, ASSESSMENT, FINAL_ASSESSMENT, RESOLUTION, GAME_OVER } =
    ESPIAO_ENTRE_NOS_PHASES;
  const order = [LOBBY, SETUP, ASSIGNMENT, INVESTIGATION, FINAL_ASSESSMENT, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound ? GAME_OVER : ASSIGNMENT;
  }

  // When players ran out of votes during final assessment
  if (outcome.type === OUTCOMES.VOTE_END && currentPhase === ASSESSMENT) {
    return RESOLUTION;
  }

  // When players vote unanimously or spy guesses
  if ([OUTCOMES.VOTE_SUCCESS, OUTCOMES.SPY_GUESS].includes(outcome.type)) {
    return RESOLUTION;
  }

  if (currentPhase === INVESTIGATION) {
    return outcome.isFinalAssessment ? FINAL_ASSESSMENT : ASSESSMENT;
  }

  if (currentPhase === ASSESSMENT) {
    return outcome.isFinalAssessment ? FINAL_ASSESSMENT : INVESTIGATION;
  }

  if (currentPhase === FINAL_ASSESSMENT) {
    return ASSESSMENT;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return INVESTIGATION;
};

/**
 * Created a list of roles, if the roles available is less than the number of players, it repeats the first role any number of times necessary
 * @param roles
 * @param playerCount
 * @returns
 */
export const createRolesPool = (roles: string[], playerCount: number): string[] => {
  const shuffledRoles = utils.game.shuffle(roles);

  const sessionRoles = new Array(playerCount).fill('').map((_, index) => {
    if (index === 0) return SPY;

    if (index - 1 >= shuffledRoles.length) return roles[0];

    return shuffledRoles[index - 1];
  });

  return utils.game.shuffle(sessionRoles);
};

/**
 * Give a role to each player
 * It modifies Players!
 * @param roles
 * @param locationName
 * @param players
 * @returns
 */
export const distributeRoles = (roles: string[], locationName: string, players: Players) => {
  let currentSpyId = '';

  utils.players.getListOfPlayers(players).forEach((player, index) => {
    const playerRole = roles[index];
    if (playerRole === SPY) {
      currentSpyId = player.id;
      player.location = SPY;
    } else {
      player.location = locationName;
    }
    player.role = playerRole;
    player.usedAccusation = false;
  });

  return currentSpyId;
};

export const calculateTimeRemaining = (timeRemaining: number, timerUpdatedAt: number): number => {
  return (timeRemaining ?? GAME_DURATION) - (timerUpdatedAt ? Date.now() - timerUpdatedAt : 0);
};

export const checkOutcome = (
  state: FirebaseStateData,
  store: FirebaseStoreData,
  players: Players,
): Outcome => {
  const timeRemaining = calculateTimeRemaining(state?.timer?.timeRemaining, Date.now());
  const isFinalAssessment = Boolean(state.finalAssessment) || timeRemaining <= 0;

  if (
    isFinalAssessment &&
    state.finalAssessment?.playerOrder?.length <= state.finalAssessment?.playerOrderIndex + 1
  ) {
    return {
      type: OUTCOMES.VOTE_END,
      isFinalAssessment: true,
    };
  }

  if (store.lastPlayerId) {
    return {
      type: OUTCOMES.CONTINUE,
      isFinalAssessment: true,
    };
  }

  if (store.guess) {
    return {
      type: OUTCOMES.SPY_GUESS,
      isFinalAssessment,
    };
  }

  if (state.phase === ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT) {
    const playersWhoVotedYes = utils.players.getListOfPlayers(players).filter((player) => player.vote);
    const isVotingSuccessful =
      utils.players.getPlayerCount(players) - 1 === Object.keys(playersWhoVotedYes).length;

    // Voting passes
    if (isVotingSuccessful) {
      return {
        type: OUTCOMES.VOTE_SUCCESS,
        isFinalAssessment,
      };
    }

    return {
      type: OUTCOMES.VOTE_FAIL,
      votedYes: playersWhoVotedYes
        .map((player) => player.name)
        .sort()
        .join(', '),
      isFinalAssessment,
    };
  }

  return {
    type: OUTCOMES.CONTINUE,
    isFinalAssessment,
  };
};

export const calculateScore = (
  players: Players,
  isSpyGuess: boolean,
  isSpyWin: boolean,
  currentSpyId: PlayerId,
  accuserId: PlayerId,
) => {
  // Calculate Points
  utils.players.getListOfPlayers(players).forEach((player) => {
    // If spy was successful, gets 4 points (if he guessed, otherwise 2 for not being found)
    if (isSpyWin && currentSpyId === player.id) {
      if (isSpyGuess) {
        player.score += 4;
      } else {
        player.score += 2;
      }

      // IF spy failed, everybody else gets 1 point
    } else if (!isSpyWin && currentSpyId !== player.id) {
      player.score += 1;
    }

    // Accuser gets 2 points if correct
    if (!isSpyWin && !isSpyGuess) {
      if (accuserId === player.id) {
        player.score += 2;
      }
    }
  });
};

export const determineFinalAssessmentPlayerOrder = (
  lastPlayerId: PlayerId,
  gameOrder: PlayerId[],
): PlayerId[] => {
  const lastPlayerIndex = gameOrder.indexOf(lastPlayerId);

  return [...gameOrder.slice(lastPlayerIndex), ...gameOrder.slice(0, lastPlayerIndex)];
};
