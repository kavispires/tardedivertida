import {
  GAME_COLLECTIONS,
  PHASES,
  GAME_PLAYERS_LIMIT,
  ESPIAO_ENTRE_NOS_CONSTANTS as E_CONSTANTS,
} from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import {
  Players,
  GameId,
  MakeMeReadyPayload,
  EspiaoEntreNosInitialState,
  FirebaseContext,
  EspiaoEntreNosAdminPayload,
  PlainObject,
  SubmitVotePayload,
  SubmitGuessPayload,
} from '../utils/interfaces';
// Resources
import { allLocationsBR } from '../resources/espiao-entre-nos';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (
  gameId: GameId,
  uid: string,
  language: string
): EspiaoEntreNosInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.ESPIAO_ENTRE_NOS,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.ESPIAO_ENTRE_NOS.min,
    max: GAME_PLAYERS_LIMIT.ESPIAO_ENTRE_NOS.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    usedLocations: [],
    currentLocation: {},
  },
  state: {
    phase: PHASES.ESPIAO_ENTRE_NOS.LOBBY,
    round: 0,
  },
});

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param outcome
 * @returns
 */
const determineNextPhase = (currentPhase: string, outcome: string): string => {
  const {
    RULES,
    ASSIGNMENT,
    INVESTIGATION,
    ASSESSMENT,
    FINAL_ASSESSMENT,
    RESOLUTION,
    GAME_OVER,
  } = PHASES.ESPIAO_ENTRE_NOS;
  const order = [RULES, ASSIGNMENT, INVESTIGATION, FINAL_ASSESSMENT, RESOLUTION, GAME_OVER];

  if (outcome === E_CONSTANTS.OUTCOME.VOTE_SUCCESS) {
    return RESOLUTION;
  }

  if (currentPhase === INVESTIGATION) {
    return ASSESSMENT;
  }

  if (currentPhase === ASSESSMENT) {
    return INVESTIGATION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return INVESTIGATION;
};

const createRolesPool = (roles: string[], numPlayers: number): string[] => {
  const shuffledRoles = gameUtils.shuffle(roles);

  const sessionRoles = new Array(numPlayers).fill('').map((newRole, index) => {
    if (index === 0) return E_CONSTANTS.SPY;

    if (index - 1 >= shuffledRoles.length) return roles[0];

    return shuffledRoles[index - 1];
  });

  return gameUtils.shuffle(sessionRoles);
};

const calculateTimeRemaining = (timeRemaining: number, timerUpdatedAt: number): number => {
  return (timeRemaining ?? E_CONSTANTS.GAME_TIME) - (timerUpdatedAt ? Date.now() - timerUpdatedAt : 0);
};

const checkResolution = (state: FirebaseFirestore.DocumentData, players: Players) => {
  if (state.phase === PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT) {
    const playersWhoVotedYes = Object.values(players).filter((player) => player.vote);
    const isVotingSuccessful = Object.keys(players).length - 1 === Object.keys(playersWhoVotedYes).length;

    // Voting passes
    if (isVotingSuccessful) {
      return {
        outcome: E_CONSTANTS.OUTCOME.VOTE_SUCCESS,
      };
    }

    return {
      outcome: E_CONSTANTS.OUTCOME.VOTE_FAIL,
      votedYes: playersWhoVotedYes.map((player) => player.name).join(', '),
    };
  }

  return {
    outcome: E_CONSTANTS.OUTCOME.CONTINUE,
  };
};

const nextEspiaoEntreNosPhase = async (
  collectionName: string,
  gameId: string,
  players: Players,
  additionalData?: PlainObject
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Determine and prepare next phase
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  const resolution = checkResolution(state, players);

  // Determine next phase
  const nextPhase = additionalData?.forcePhase || determineNextPhase(state?.phase, resolution?.outcome ?? '');

  // * -> ASSIGNMENT
  if (nextPhase === PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT) {
    return prepareAssignmentPhase(sessionRef, store, state, players);
  }

  // INVESTIGATION -> ASSESSMENT
  if (nextPhase === PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION) {
    return prepareInvestigationPhase(sessionRef, state, { ...resolution, ...(additionalData ?? {}) });
  }

  // INVESTIGATION -> ASSESSMENT
  if (nextPhase === PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT) {
    return prepareAssessmentPhase(sessionRef, state, players, additionalData ?? {});
  }

  // * -> FINAL_ASSESSMENT
  if (nextPhase === PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT) {
    return prepareFinalAssessmentPhase(sessionRef, players);
  }

  // * -> FINAL_ASSESSMENT
  if (nextPhase === PHASES.ESPIAO_ENTRE_NOS.RESOLUTION) {
    return prepareResolutionPhase(sessionRef, store, state, players, additionalData ?? {});
  }

  // * -> GAME_OVER
  if (nextPhase === PHASES.ONDA_TELEPATICA.GAME_OVER) {
    return prepareGameOverPhase(sessionRef, players);
  }

  return true;
};

const prepareAssignmentPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Determine round number
  const newRound = state.round + 1;
  const source = allLocationsBR;

  const usedLocationsIds = store?.usedLocations ?? [];
  const possibleLocations = Object.values(source)
    .filter((location) => !usedLocationsIds.includes(location.id))
    .map((location) => location.name)
    .sort((a, b) => (a > b ? 1 : -1));

  // Determine random location
  const allLocationsIds = Object.keys(source);
  const currentLocationId = gameUtils.getRandomUniqueItem(allLocationsIds, usedLocationsIds);
  const currentLocation = source[currentLocationId];

  // Distribute roles
  const availableRoles = createRolesPool(currentLocation.roles, Object.keys(players).length);

  let currentSpy = '';

  Object.values(players).forEach((player, index) => {
    const playerRole = availableRoles[index];
    if (playerRole === E_CONSTANTS.SPY) {
      currentSpy = player.name;
      player.location = E_CONSTANTS.SPY;
    } else {
      player.location = currentLocation.name;
    }
    player.role = playerRole;
    player.usedAccusation = false;
    player.false = false;
  });

  // Save used cards to store
  await sessionRef.doc('store').update({
    currentLocation,
    usedLocations: [...store.usedLocations, currentLocationId],
  });

  await sessionRef.doc('players').set(players);

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT,
    updatedAt: Date.now(),
    round: newRound,
    currentSpy,
    currentLocation,
    possibleLocations,
  });

  return true;
};

const prepareAssessmentPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  payload: PlainObject
) => {
  const { accuser, target, pausedAt } = payload;

  // Unready players but the accuser
  const newPlayers = utils.unReadyPlayers(players, accuser);
  newPlayers[target].ready = true; // the target doesn't get to vote

  // Remove previous votes
  utils.modifyPlayers(players, 'vote', false);

  // Save player as having used their accusation
  newPlayers[accuser].usedAccusation = true;
  newPlayers[accuser].vote = true;

  await sessionRef.doc('players').set(players);

  // Save new state
  await sessionRef.doc('state').update({
    phase: PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT,
    updatedAt: Date.now(),
    target,
    accuser,
    timerUpdatedAt: pausedAt,
    timeRemaining: calculateTimeRemaining(state.timeRemaining, state.timerUpdatedAt),
    timerStatus: E_CONSTANTS.TIMER_STATUS.PAUSED,
  });

  return true;
};

const prepareInvestigationPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  state: FirebaseFirestore.DocumentData,
  resolution: PlainObject
) => {
  const additionalUpdate: PlainObject = {};
  if (resolution.outcome === E_CONSTANTS.OUTCOME.VOTE_FAIL) {
    additionalUpdate.outcome = E_CONSTANTS.OUTCOME.VOTE_FAIL;
    additionalUpdate.votedYes = resolution.votedYes ?? '';
  }

  const timeRemaining = calculateTimeRemaining(state.timeRemaining, state.timerUpdatedAt);

  // Save new state
  await sessionRef.doc('state').update({
    phase: PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION,
    updatedAt: Date.now(),
    target: utils.deleteValue(),
    accuser: utils.deleteValue(),
    timerUpdatedAt: Date.now(),
    timeRemaining,
    timerStatus: E_CONSTANTS.TIMER_STATUS.RUNNING,
    ...additionalUpdate,
  });

  return true;
};

const prepareFinalAssessmentPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  players: Players
) => {
  // Save new state
  await sessionRef.doc('state').update({
    phase: PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT,
    updatedAt: Date.now(),
    target: utils.deleteValue(),
    accuser: utils.deleteValue(),
    timerStartedAt: utils.deleteValue(),
    timeRemaining: utils.deleteValue(),
    playerOrder: gameUtils.shuffle(Object.keys(players)),
    timerStatus: E_CONSTANTS.TIMER_STATUS.STOPPED,
  });

  return true;
};

const prepareResolutionPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  payload: PlainObject
) => {
  const resolutionType = payload?.guess ? E_CONSTANTS.RESOLUTION.SPY_GUESS : E_CONSTANTS.RESOLUTION.SPY_FOUND;
  const isSpyGuess = resolutionType === E_CONSTANTS.RESOLUTION.SPY_GUESS;

  // Determine if spy guessed correctly
  const stateUpdate: PlainObject = {};
  if (resolutionType === E_CONSTANTS.RESOLUTION.SPY_GUESS) {
    stateUpdate.guess = payload.guess;
    stateUpdate.currentLocation = store.currentLocation.name;
    stateUpdate.spyWin = payload.guess === store.currentLocation.name;
  } else {
    stateUpdate.spyWin = (payload?.target ?? state.target) !== state.currentSpy;
  }

  // Calculate Points
  Object.values(players).forEach((player) => {
    // If spy was successful, gets 4 points (if he guessed, otherwise 2 for not being found)
    if (stateUpdate.spyWin && state.currentSpy === player.name) {
      if (isSpyGuess) {
        player.score += 4;
      } else {
        player.score += 2;
      }

      // IF spy failed, everybody else gets 1 point
    } else if (!stateUpdate.spyWin && state.currentSpy !== player.name) {
      player.score += 1;
    }

    // Accuser gets 2 points if correct
    if (!stateUpdate.spyWin && resolutionType === E_CONSTANTS.RESOLUTION.SPY_FOUND) {
      if ((payload?.accuser ?? state.accuser) === player.name) {
        player.score += 2;
      }
    }
  });

  await sessionRef.doc('players').update(players);

  // Save new state
  await sessionRef.doc('state').update({
    phase: PHASES.ESPIAO_ENTRE_NOS.RESOLUTION,
    updatedAt: Date.now(),
    resolutionType,
    timerStatus: E_CONSTANTS.TIMER_STATUS.STOPPED,
    outcome: utils.deleteValue(),
    ...stateUpdate,
  });

  return true;
};

const prepareGameOverPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  players: Players
) => {
  const maxScore = Math.max(...Object.values(players).map((player) => player.score));
  const winners = Object.values(players).filter((player) => {
    return player.score === maxScore;
  });

  await sessionRef.doc('state').set({
    phase: PHASES.ESPIAO_ENTRE_NOS.GAME_OVER,
    gameEndedAt: Date.now(),
    winners,
    timeRemaining: 0,
  });

  await sessionRef.doc('meta').update({
    isComplete: true,
  });

  return true;
};

const prepareInGamePhase = async (collectionName: string, gameId: string, action: string) => {
  const actionText = `${action} game`;

  // Determine and prepare next phase
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const state = stateDoc.data() ?? {};

  const stateUpdate: PlainObject = {
    ...state,
    updatedAt: Date.now(),
  };

  switch (action) {
    case 'start':
      stateUpdate.phase = PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION;
      stateUpdate.timerUpdatedAt = Date.now();
      stateUpdate.timeRemaining = E_CONSTANTS.GAME_TIME;
      stateUpdate.timerStatus = E_CONSTANTS.TIMER_STATUS.RUNNING;
      break;
    case 'resume':
      stateUpdate.phase = PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION;
      stateUpdate.timerUpdatedAt = Date.now();
      stateUpdate.timerStatus = E_CONSTANTS.TIMER_STATUS.RUNNING;
      break;
    case 'stop':
      stateUpdate.phase = PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT;
      stateUpdate.timeRemaining = 0;
      stateUpdate.timerStatus = E_CONSTANTS.TIMER_STATUS.STOPPED;
      break;
    default:
      stateUpdate.phase = PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT;
      stateUpdate.timerUpdatedAt = Date.now();
      stateUpdate.timeRemaining = calculateTimeRemaining(state.timeRemaining, state.timerUpdatedAt);
      stateUpdate.timerStatus = E_CONSTANTS.TIMER_STATUS.PAUSED;
  }

  await sessionRef.doc('state').update(stateUpdate);

  return true;
};

export const makeMeReady = async (data: MakeMeReadyPayload) => {
  const { gameId, gameName: collectionName, playerName } = data;

  const actionText = 'make you ready';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerName);

  if (!utils.isEverybodyReady(updatedPlayers)) {
    try {
      await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
      return true;
    } catch (error) {
      utils.throwException(error, actionText);
    }
  }

  // If all players are ready, trigger next phase
  return nextEspiaoEntreNosPhase(collectionName, gameId, players);
};

export const handleAdminAction = async (data: EspiaoEntreNosAdminPayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName, action } = data;

  const actionText = `${action} stopwatch`;
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(action, 'action', actionText);
  utils.verifyAuth(context, actionText);

  // resume, pause => timer functions
  if (typeof action === 'string' && ['start', 'pause', 'resume', 'stop'].includes(action)) {
    return prepareInGamePhase(collectionName, gameId, action);
  }

  // Get 'players' from given game session
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players = playersDoc.data() ?? {};

  // round => starts new round with new assignment phase
  if (typeof action === 'string' && action === 'round') {
    return nextEspiaoEntreNosPhase(collectionName, gameId, players, {
      forcePhase: PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT,
    });
  }

  // final => goes to game over
  if (typeof action === 'string' && action === 'end') {
    return nextEspiaoEntreNosPhase(collectionName, gameId, players, {
      forcePhase: PHASES.ESPIAO_ENTRE_NOS.GAME_OVER,
    });
  }

  // end => goes to final assessment
  if (typeof action === 'string' && action === 'final') {
    return nextEspiaoEntreNosPhase(collectionName, gameId, players, {
      forcePhase: PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT,
    });
  }

  // final-assessment voting
  return nextEspiaoEntreNosPhase(collectionName, gameId, players, {
    target: action.vote,
    accuser: action.accuser,
    forcePhase: PHASES.ESPIAO_ENTRE_NOS.RESOLUTION,
  });
};

export const makeAccusation = async (data: SubmitVotePayload) => {
  const { gameId, gameName: collectionName, playerName, vote } = data;

  const actionText = 'submit your vote';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(vote, 'vote', actionText);

  const pausedAt = Date.now();

  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};

  return nextEspiaoEntreNosPhase(collectionName, gameId, players, {
    accuser: playerName,
    target: vote,
    pausedAt,
  });
};

export const submitVoting = async (data: SubmitVotePayload) => {
  const { gameId, gameName: collectionName, playerName, vote } = data;

  const actionText = 'submit your vote';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(vote, 'vote', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerName);
  updatedPlayers[playerName].vote = vote;

  try {
    await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextEspiaoEntreNosPhase(collectionName, gameId, players);
};

export const guessLocation = async (data: SubmitGuessPayload) => {
  const { gameId, gameName: collectionName, playerName, guess } = data;

  const actionText = 'submit your vote';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(guess, 'vote', actionText);

  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};

  return nextEspiaoEntreNosPhase(collectionName, gameId, players, {
    spy: playerName,
    guess,
    forcePhase: PHASES.ESPIAO_ENTRE_NOS.RESOLUTION,
  });
};
