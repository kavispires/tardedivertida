import { GAME_COLLECTIONS, PHASES, ONDA_TELEPATICA_GOAL, GAME_PLAYERS_LIMIT } from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import {
  Players,
  GameId,
  MakeMeReadyPayload,
  OndaTelepaticaInitialState,
  BasicGamePayload,
  FirebaseContext,
  OndaTelepaticaSubmitCluePayload,
  OndaTelepaticaSubmitSidesPayload,
  OndaTelepaticaSubmitGuessPayload,
  OndaTelepaticaSubmitRivalGuessPayload,
  Teams,
  PlainObject,
} from '../utils/interfaces';
// Resources
import { allCardsBR } from '../resources/onda-telepatica-cards';

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
): OndaTelepaticaInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.ONDA_TELEPATICA,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.ONDA_TELEPATICA.min,
    max: GAME_PLAYERS_LIMIT.ONDA_TELEPATICA.max,
    isLocked: false,
    isComplete: false,
    language,
  },
  players: {},
  store: {
    teams: {},
    usedCards: {},
    currentCard: [],
  },
  state: {
    phase: PHASES.ONDA_TELEPATICA.LOBBY,
    round: 0,
    teams: {},
  },
});

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param pointsToVictory
 * @returns
 */
const determineNextPhase = (currentPhase: string, pointsToVictory: number): string => {
  const { RULES, DIAL_SIDES, DIAL_CLUE, GUESS, RIVAL_GUESS, REVEAL, GAME_OVER } = PHASES.ONDA_TELEPATICA;
  const order = [RULES, DIAL_SIDES, DIAL_CLUE, GUESS, RIVAL_GUESS, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return pointsToVictory <= 0 ? GAME_OVER : DIAL_SIDES;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return DIAL_SIDES;
};

const determineScore = (guess: number, target: number): number => {
  const difference = Math.abs(target - guess);

  switch (difference) {
    case 0:
      return 4;
    case 1:
      return 3;
    case 2:
      return 2;
    default:
      return 0;
  }
};

const determineRivalScore = (rivalGuess: number, guess: number, target: number): number => {
  const result = target > guess ? 1 : target < guess ? -1 : 0;

  if (result === rivalGuess) return 1;

  return 0;
};

const getRivalTeam = (activeTeam: string): string => {
  return activeTeam === 'A' ? 'B' : 'A';
};

const nextOndaTelepaticaPhase = async (
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

  // Perform setup
  if (state?.phase === 'RULES') {
    const teams = utils.determineTeams(players, 2);
    store.teams = teams;
    await sessionRef.doc('players').set(players);
    await sessionRef.doc('store').update({ teams });
    // Note: turn order is dynamically determined in the dial sides phase preparation
  }

  // Calculate points to victory
  const pointsToVictory = utils.getPointsToVictory(store.teams, ONDA_TELEPATICA_GOAL);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, pointsToVictory);

  // * -> DIAL_SIDES
  if (nextPhase === PHASES.ONDA_TELEPATICA.DIAL_SIDES) {
    return prepareDialSidesPhase(sessionRef, store, state, players, pointsToVictory);
  }

  // DIAL_SIDES -> DIAL_CLUE
  if (nextPhase === PHASES.ONDA_TELEPATICA.DIAL_CLUE) {
    return prepareDialCluePhase(sessionRef, store, state, players, pointsToVictory);
  }

  // DIAL_CLUE -> GUESS
  if (nextPhase === PHASES.ONDA_TELEPATICA.GUESS) {
    return prepareGuessPhase(sessionRef, store, state, players, pointsToVictory);
  }

  // GUESS -> RIVAL_GUESS
  if (nextPhase === PHASES.ONDA_TELEPATICA.RIVAL_GUESS) {
    return prepareRivalGuessPhase(sessionRef, store, state, players, pointsToVictory);
  }

  // RIVAL_GUESS -> REVEAL
  if (nextPhase === PHASES.ONDA_TELEPATICA.REVEAL) {
    return prepareRevealPhase(sessionRef, store, state, players, pointsToVictory);
  }

  // REVEAL -> GAME_OVER
  if (nextPhase === PHASES.ONDA_TELEPATICA.GAME_OVER) {
    return prepareGameOverPhase(sessionRef, store, players, state);
  }

  return true;
};

const prepareDialSidesPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  // Determine round number
  const newRound = state.round + 1;

  // Determine active team
  const activeTeam = state.shouldCatchup ? state?.activeTeam : state?.activeTeam === 'A' ? 'B' : 'A';
  const rivalTeam = getRivalTeam(activeTeam);

  // Determine psychic
  const lastPsychic = store?.[`lastPsychic${activeTeam}`] || null;
  const newPsychic = gameUtils.getNextItem(store.teams[activeTeam].members, lastPsychic);
  const teamController = gameUtils.getPreviousItem(store.teams[activeTeam].members, newPsychic);

  // Determine rival psychic
  const lastRivalPsychic = store?.[`lastPsychic${rivalTeam}`] || null;
  const rivalController =
    lastRivalPsychic ||
    gameUtils.getPreviousItem(store.teams[rivalTeam].members, store.teams[rivalTeam].members[0]);

  // Get 2 cards
  const allCardsIds = Object.keys(allCardsBR);
  const usedCards = Object.keys(store?.usedCards);
  const cardsIds = gameUtils.getRandomUniqueItems(allCardsIds, usedCards, 2);

  // Update store and state
  const newCards = cardsIds.reduce((cardObjects, cardId) => {
    const cardDB = allCardsBR[cardId];
    cardObjects[cardId] = {
      id: cardId,
      left: cardDB.left,
      right: cardDB.right,
      target: gameUtils.getRandomNumber(-10, 10),
      needle: 0,
      clue: '',
      rival: 0,
    };

    return cardObjects;
  }, {});

  const lastPsychicUpdate: PlainObject = {};
  if (activeTeam === 'A') {
    lastPsychicUpdate.lastPsychicA = newPsychic;
  }
  if (activeTeam === 'B') {
    lastPsychicUpdate.lastPsychicB = newPsychic;
  }

  // Save used cards to store
  await sessionRef.doc('store').update({
    currentCards: newCards,
    ...lastPsychicUpdate,
  });

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ONDA_TELEPATICA.DIAL_SIDES,
    updatedAt: Date.now(),
    round: newRound,
    teams: store?.teams,
    activeTeam: activeTeam,
    psychic: newPsychic,
    teamController,
    rivalController,
    pointsToVictory,
    cards: Object.values(newCards),
    catchup: false,
  });

  return true;
};

const prepareDialCluePhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ONDA_TELEPATICA.DIAL_CLUE,
    updatedAt: Date.now(),
    round: state.round,
    teams: state.teams,
    activeTeam: state.activeTeam,
    psychic: state.psychic,
    teamController: state.teamController,
    rivalController: state.rivalController,
    pointsToVictory,
    card: store.currentCards[store.currentCardId],
  });

  return true;
};

const prepareGuessPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ONDA_TELEPATICA.GUESS,
    updatedAt: Date.now(),
    round: state.round,
    teams: state.teams,
    activeTeam: state.activeTeam,
    psychic: state.psychic,
    teamController: state.teamController,
    rivalController: state.rivalController,
    pointsToVictory,
    card: { ...state.card, clue: store.clue },
  });

  return true;
};

const prepareRivalGuessPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ONDA_TELEPATICA.RIVAL_GUESS,
    updatedAt: Date.now(),
    round: state.round,
    teams: state.teams,
    activeTeam: state.activeTeam,
    psychic: state.psychic,
    teamController: state.teamController,
    rivalController: state.rivalController,
    pointsToVictory,
    card: { ...state.card, needle: store.activeTeamGuess },
  });

  return true;
};

const prepareRevealPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  const card = { ...state.card, rival: store.rivalTeamGuess };
  const rivalTeam = getRivalTeam(state.activeTeam);
  // Calculate points
  const score = determineScore(card.needle, card.target);
  const rivalScore = determineRivalScore(store.rivalTeamGuess, card.needle, card.target);

  // Give points to teams
  const teams = { ...state.teams };
  teams[state.activeTeam].score += score;
  teams[rivalTeam].score += rivalScore;

  // Give points to individual players
  Object.values(players).forEach((player) => {
    if (player.team === state.activeTeam) {
      player.score += score;
    } else {
      player.score += rivalScore;
    }
  });

  await sessionRef.doc('players').set({
    ...utils.readyPlayers(players),
  });

  // Determine if should have a catchup: got 4 points and still behind
  const shouldCatchup = score === 4 && teams[state.activeTeam].score < teams[rivalTeam].score;

  // Save data to store and clear store
  const usedCards = {
    ...store.usedCards,
    ...store.currentCards,
    [card.id]: card,
  };

  await sessionRef.doc('store').update({
    usedCards,
    teams,
    activeTeamGuess: utils.deleteValue(),
    rivalTeamGuess: utils.deleteValue(),
    clue: utils.deleteValue(),
    currentCard: utils.deleteValue(),
    currentCardId: utils.deleteValue(),
    currentCards: utils.deleteValue(),
  });

  await sessionRef.doc('store').update({
    usedCards,
    teams,
    activeTeamGuess: utils.deleteValue(),
    rivalTeamGuess: utils.deleteValue(),
    clue: utils.deleteValue(),
    currentCard: utils.deleteValue(),
    currentCardId: utils.deleteValue(),
    currentCards: utils.deleteValue(),
  });

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ONDA_TELEPATICA.REVEAL,
    updatedAt: Date.now(),
    round: state.round,
    teams: state.teams,
    activeTeam: state.activeTeam,
    shouldCatchup,
    pointsToVictory,
    card: { ...state.card, rival: store.rivalTeamGuess },
    pointsBreakdown: {
      [state.activeTeam]: {
        had: teams[state.activeTeam].score - score,
        got: score,
        now: teams[state.activeTeam].score,
      },
      [rivalTeam]: {
        had: teams[rivalTeam].score - rivalScore,
        got: rivalScore,
        now: teams[rivalTeam].score,
      },
    },
  });
  return true;
};

const prepareGameOverPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  players: Players,
  state: FirebaseFirestore.DocumentData
) => {
  const maxScore = Math.max(...Object.values(<Teams>store.teams).map((team) => team.score));
  const winners = Object.values(players).filter((player) => {
    return player.score === maxScore;
  });

  await sessionRef.doc('state').set({
    phase: PHASES.ONDA_TELEPATICA.GAME_OVER,
    round: state.round,
    winners,
    gameEndedAt: Date.now(),
  });

  await sessionRef.doc('meta').update({
    isComplete: true,
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
  return nextOndaTelepaticaPhase(collectionName, gameId, players);
};

export const submitSides = async (data: OndaTelepaticaSubmitSidesPayload) => {
  const { gameId, gameName: collectionName, playerName, cardId } = data;

  const actionText = 'submit the suggestions validation';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(cardId, 'cardId', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ currentCardId: cardId });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextOndaTelepaticaPhase(collectionName, gameId, players);
};

export const submitClue = async (data: OndaTelepaticaSubmitCluePayload) => {
  const { gameId, gameName: collectionName, playerName, clue } = data;

  const actionText = 'submit the suggestions validation';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(clue, 'clue', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ clue });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextOndaTelepaticaPhase(collectionName, gameId, players);
};

export const submitGuess = async (data: OndaTelepaticaSubmitGuessPayload) => {
  const { gameId, gameName: collectionName, playerName, guess } = data;

  const actionText = 'submit the suggestions validation';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(guess, 'guess', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ activeTeamGuess: guess });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextOndaTelepaticaPhase(collectionName, gameId, players);
};

export const submitRivalGuess = async (data: OndaTelepaticaSubmitRivalGuessPayload) => {
  const { gameId, gameName: collectionName, playerName, rivalGuess } = data;

  const actionText = 'submit the suggestions validation';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(rivalGuess, 'rivalGuess', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ rivalTeamGuess: rivalGuess });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextOndaTelepaticaPhase(collectionName, gameId, players);
};

export const goToNextPhase = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'go to new round';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  return nextOndaTelepaticaPhase(collectionName, gameId, players);
};
