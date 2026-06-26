import { shuffle } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, Outcome } from './types';
// Constants
import { ESPIAO_ENTRE_NOS_PHASES, GAME_DURATION, OUTCOMES, SPY } from './constants';
// Mechanics
import { getListOfPlayers, getPlayerCount } from '../../mechanics/players';
import { nextPhaseDelegator } from '../../mechanics/session';

/**
 * Determines the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the investigation
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: Outcome): string => {
  const { SETUP, ASSIGNMENT, INVESTIGATION, ASSESSMENT, FINAL_ASSESSMENT, RESOLUTION, GAME_OVER } =
    ESPIAO_ENTRE_NOS_PHASES;
  const order = [SETUP, ASSIGNMENT, INVESTIGATION, FINAL_ASSESSMENT, RESOLUTION, GAME_OVER];

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

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Creates a list of roles, repeating the first role if needed to match player count
 * @param roles - The array of available roles
 * @param playerCount - The number of players in the game
 */
export const createRolesPool = (roles: string[], playerCount: number): string[] => {
  const shuffledRoles = shuffle(roles);

  const sessionRoles = new Array(playerCount).fill('').map((_, index) => {
    if (index === 0) return SPY;

    if (index - 1 >= shuffledRoles.length) return roles[0];

    return shuffledRoles[index - 1];
  });

  return shuffle(sessionRoles);
};

/**
 * Distributes roles to each player and identifies the spy
 * @param roles - The array of roles to distribute
 * @param locationName - The name of the location
 * @param players - The collection of players in the game
 */
export const distributeRoles = (roles: string[], locationName: string, players: Players) => {
  let currentSpyId = '';

  getListOfPlayers(players).forEach((player, index) => {
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

/**
 * Calculates the remaining time based on the timer state
 * @param timeRemaining - The time remaining in milliseconds
 * @param timerUpdatedAt - The timestamp when the timer was last updated
 */
export const calculateTimeRemaining = (timeRemaining: number, timerUpdatedAt: number): number => {
  return (timeRemaining ?? GAME_DURATION) - (timerUpdatedAt ? Date.now() - timerUpdatedAt : 0);
};

/**
 * Checks the current game outcome based on timer, voting, and spy actions
 * @param state - The current state data from Firebase
 * @param store - The Firebase store data
 * @param players - The collection of players in the game
 */
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
    const playersWhoVotedYes = getListOfPlayers(players).filter((player) => player.vote);
    const isVotingSuccessful = getPlayerCount(players) - 1 === Object.keys(playersWhoVotedYes).length;

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

/**
 * Calculates player scores based on spy outcomes and accusations
 * @param players - The collection of players in the game
 * @param isSpyGuess - Whether the spy made a guess
 * @param isSpyWin - Whether the spy won
 * @param currentSpyId - The ID of the current spy player
 * @param accuserId - The ID of the player who accused the spy
 */
export const calculateScore = (
  players: Players,
  isSpyGuess: boolean,
  isSpyWin: boolean,
  currentSpyId: UID,
  accuserId: UID,
) => {
  // Calculate Points
  getListOfPlayers(players).forEach((player) => {
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

/**
 * Determines the player order for final assessment starting from the last player
 * @param lastPlayerId - The ID of the last player
 * @param gameOrder - The array of player IDs in game order
 */
export const determineFinalAssessmentPlayerOrder = (lastPlayerId: UID, gameOrder: UID[]): UID[] => {
  const lastPlayerIndex = gameOrder.indexOf(lastPlayerId);

  return [...gameOrder.slice(lastPlayerIndex), ...gameOrder.slice(0, lastPlayerIndex)];
};
