import { GAME_COLLECTIONS, PHASES, GAME_PLAYERS_LIMIT, SPY } from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import { Players, GameId, MakeMeReadyPayload, EspiaoEntreNosInitialState } from '../utils/interfaces';
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
 * @param pointsToVictory
 * @returns
 */
const determineNextPhase = (currentPhase: string): string => {
  const { RULES, ASSIGNMENT, INVESTIGATION, FINAL_ASSESSMENT, GAME_OVER } = PHASES.ESPIAO_ENTRE_NOS;
  const order = [RULES, ASSIGNMENT, INVESTIGATION, FINAL_ASSESSMENT, GAME_OVER];

  if (currentPhase === INVESTIGATION) {
    // TODO idk
    // return pointsToVictory <= 0 ? GAME_OVER : DIAL_SIDES;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return INVESTIGATION;
};

const nextEspiaoEntreNosPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Determine and prepare next phase
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  // Perform reset on any previous session stuff
  if (state?.phase === 'RULES') {
    // Select a random location
    // Distribute roles
    // const teams = utils.determineTeams(players, 2);
    // store.teams = teams;
    // await sessionRef.doc('players').set(players);
    // await sessionRef.doc('store').update({
    //   teams,
    //   lastPsychicA: utils.deleteValue(),
    //   lastPsychicB: utils.deleteValue(),
    // });
    // Note: turn order is determine live via player talks
  }

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase);

  // * -> ASSIGNMENT
  if (nextPhase === PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT) {
    return prepareAssignmentPhase(sessionRef, store, state, players);
  }

  // // // DIAL_SIDES -> DIAL_CLUE
  // // if (nextPhase === PHASES.ONDA_TELEPATICA.DIAL_CLUE) {
  // //   return prepareDialCluePhase(sessionRef, store, state, players, pointsToVictory);
  // // }

  // // // DIAL_CLUE -> GUESS
  // // if (nextPhase === PHASES.ONDA_TELEPATICA.GUESS) {
  // //   return prepareGuessPhase(sessionRef, store, state, players, pointsToVictory);
  // // }

  // // // GUESS -> RIVAL_GUESS
  // // if (nextPhase === PHASES.ONDA_TELEPATICA.RIVAL_GUESS) {
  // //   return prepareRivalGuessPhase(sessionRef, store, state, players, pointsToVictory);
  // // }

  // // // RIVAL_GUESS -> REVEAL
  // // if (nextPhase === PHASES.ONDA_TELEPATICA.REVEAL) {
  // //   return prepareRevealPhase(sessionRef, store, state, players, pointsToVictory);
  // // }

  // // // REVEAL -> GAME_OVER
  // // if (nextPhase === PHASES.ONDA_TELEPATICA.GAME_OVER) {
  // //   return prepareGameOverPhase(sessionRef, store, players, state);
  // // }

  return true;
};

const createRolesPool = (roles: string[], numPlayers: number): string[] => {
  const shuffledRoles = gameUtils.shuffle(roles);

  const sessionRoles = new Array(numPlayers).fill('').map((newRole, index) => {
    if (index === 0) return SPY;

    if (index - 1 >= shuffledRoles.length) return roles[0];

    return shuffledRoles[index - 1];
  });

  return gameUtils.shuffle(sessionRoles);
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
  // Determine random location
  const allLocationsIds = Object.keys(source);
  const usedLocationsIds = store?.usedLocations ?? [];
  const currentLocationId = gameUtils.getRandomUniqueItem(allLocationsIds, usedLocationsIds);
  const currentLocation = source[currentLocationId];

  // Distribute roles
  const availableRoles = createRolesPool(currentLocation.roles, Object.keys(players).length);

  let currentSpy = '';

  Object.values(players).forEach((player, index) => {
    const playerRole = availableRoles[index];
    if (playerRole === SPY) {
      currentSpy = player.name;
      player.location = SPY;
    } else {
      player.location = currentLocation.name;
    }
    player.role = playerRole;
  });

  // Save used cards to store
  await sessionRef.doc('store').update({
    currentLocation,
    usedLocations: [...store.usedLocations, currentLocationId],
  });

  await sessionRef.doc('players').set(players);

  const possibleLocations = Object.values(source)
    .map((location) => location.name)
    .sort((a, b) => (a < b ? 1 : -1));

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT,
    updatedAt: Date.now(),
    round: newRound,
    currentSpy,
    possibleLocations,
    timeRemaining: 8 * 60,
  });

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
