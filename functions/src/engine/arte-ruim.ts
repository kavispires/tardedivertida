import {
  GAME_COLLECTIONS,
  PHASES,
  ARTE_RUIM_GOAL,
  ARTE_RUIM_CARDS_BY_LEVEL,
  GAME_PLAYERS_LIMIT,
} from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import {
  ArteRuimInitialState,
  Players,
  BasicGamePayload,
  PlainObject,
  GameId,
  SubmitDrawingPayload,
  SubmitVotesPayload,
  FirebaseContext,
} from '../utils/interfaces';
// Resources
import { allCardsBR } from '../resources/arte-ruim-cards.js';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (gameId: GameId, uid: string, language: string): ArteRuimInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.ARTE_RUIM,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.ARTE_RUIM.min,
    max: GAME_PLAYERS_LIMIT.ARTE_RUIM.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    usedCards: [],
    currentCards: [],
    pastDrawings: [],
  },
  state: {
    phase: PHASES.ARTE_RUIM.LOBBY,
    round: 0,
    updatedAt: Date.now(),
  },
});

/**
 * Calculate what level of cards it should be gotten
 * @param pointsToVictory
 * @param goal
 * @returns
 */
const getLevel = (pointsToVictory: number, goal: number): number => {
  return pointsToVictory <= goal / 3 ? 3 : pointsToVictory <= (goal * 2) / 3 ? 2 : 1;
};

/**
 * Get the group of cards according to the given level
 * @param level
 * @returns
 */
const getCardsForLevel = (level: number): string[] => {
  return ARTE_RUIM_CARDS_BY_LEVEL[level];
};

/**
 * Determine the number of cards in a round
 * @param players
 * @returns
 */
const determineNumberOfCards = (players: Players): number => {
  const playerCount = Object.keys(players).length;
  if (playerCount < 5) {
    return 7;
  }
  return playerCount + 2;
};

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param pointsToVictory
 * @returns
 */
const determineNextPhase = (currentPhase: string, pointsToVictory: number): string => {
  const { RULES, DRAW, EVALUATION, GALLERY, GAME_OVER } = PHASES.ARTE_RUIM;
  const order = [RULES, DRAW, EVALUATION, GALLERY];

  if (currentPhase === GALLERY) {
    return pointsToVictory <= 0 ? GAME_OVER : DRAW;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return DRAW;
};

const prepareDrawPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  const level = getLevel(pointsToVictory, ARTE_RUIM_GOAL);
  // Get random cards
  const numberOfCards = determineNumberOfCards(players);
  const allCards = getCardsForLevel(level);
  const usedCards = store?.usedCards ?? [];
  const cards = gameUtils.getRandomUniqueItems(allCards, usedCards, numberOfCards);

  // Unready players
  const newPlayers = utils.unReadyPlayers(players);

  // Assign one card per player
  const playersIds = Object.keys(players);
  const newUsedCards: string[] = [];
  const currentCards = cards.map((cardId, index) => {
    const currentPlayerId = playersIds?.[index] ?? null;

    const card = allCardsBR[cardId];
    const newCard = {
      id: cardId,
      level: card.level,
      text: card.text,
      playerId: currentPlayerId,
      drawing: null,
      successRate: 0,
    };

    if (currentPlayerId) {
      newPlayers[currentPlayerId].currentCard = newCard;
      delete newPlayers[currentPlayerId].votes;
    }

    newUsedCards.push(cardId);

    return newCard;
  });

  // Save used cards to store
  await sessionRef.doc('store').update({
    usedCards: [...usedCards, ...newUsedCards],
    currentCards,
  });

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ARTE_RUIM.DRAW,
    updatedAt: Date.now(),
    pointsToVictory,
    round: (state?.round ?? 0) + 1,
  });
  // Unready players and return
  await sessionRef.doc('players').set(players);

  return true;
};

const prepareEvaluationPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  pointsToVictory: number
) => {
  const shuffledCards = gameUtils.shuffle(store.currentCards);

  const allDrawings = Object.values(players).map((player) => player.currentCard);

  const shuffledDrawings = gameUtils.shuffle(allDrawings);

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.ARTE_RUIM.EVALUATION,
    updatedAt: Date.now(),
    round: state?.round ?? 0,
    pointsToVictory,
    cards: shuffledCards,
    drawings: shuffledDrawings,
  });

  // Unready players and return
  await sessionRef.doc('players').set(utils.unReadyPlayers(players));

  return true;
};

const prepareGalleryPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Calculate everybody's points
  const gallery = state.drawings.map((drawingEntry) => {
    const correctAnswer = `${drawingEntry.id}`;
    const artist = drawingEntry.playerId;

    const newGalleryEntry = {
      id: drawingEntry.id,
      drawing: drawingEntry.drawing,
      artist: drawingEntry.playerId,
      level: drawingEntry.level,
      text: drawingEntry.text,
      playersSay: {},
      playersPoints: {},
    };

    const playersSay = {};
    const playersPoints = {};

    Object.entries(<PlainObject>players).forEach(([playerId, pObject]) => {
      if (artist === playerId) return;

      // Calculate what players say
      const currentVote = pObject.votes[correctAnswer];
      if (playersSay[currentVote] === undefined) {
        playersSay[currentVote] = [];
      }
      playersSay[currentVote].push(playerId);
      // Calculate player points
      if (playersPoints[playerId] === undefined) {
        playersPoints[playerId] = 0;
      }
      if (playersPoints[artist] === undefined) {
        playersPoints[artist] = 0;
      }

      if (currentVote === correctAnswer) {
        playersPoints[playerId] += 2;
        playersPoints[artist] += 1;
      }
    });
    newGalleryEntry.playersSay = playersSay;
    newGalleryEntry.playersPoints = playersPoints;
    return newGalleryEntry;
  });

  // -- Ranking Stuff Start
  // Loop state gallery and gather points
  const newPlayers = utils.unReadyPlayers(players);

  // Format <player>: [<old score>, <addition points>, <new score>]
  const newScores: PlainObject = {};

  // Build score object
  Object.values(newPlayers).forEach((player) => {
    newScores[player.id] = [player.score, 0, player.score];
  });

  gallery.forEach((window) => {
    Object.entries(window.playersPoints).forEach(([playerId, value]) => {
      const points = Number(value ?? 0);
      newScores[playerId][1] += points;
      newScores[playerId][2] += points;

      newPlayers[playerId].score += points;
    });
  });

  const ranking = Object.entries(newScores)
    .map(([playerId, scores]) => {
      return {
        playerId,
        previousScore: scores[0],
        gainedPoints: scores[1],
        newScore: scores[2],
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  const numPlayers = Object.keys(newPlayers).length;
  // Remove currentCard from players and add it to past drawings in the store
  const pastDrawings = Object.values(newPlayers).map((playerData) => {
    const card = playerData.currentCard;
    // Get playersSay from gallery and calculate success rate
    const galleryEntry = gallery.find((e) => e.id === card.id);
    const correctAnswers = galleryEntry.playersSay?.[card.id]?.length ?? 0;

    card.successRate = Math.round((100 * correctAnswers) / (numPlayers - 1)) / 100;
    return card;
  });

  // clear store
  await sessionRef.doc('store').update({
    pastDrawings: [...pastDrawings, ...store.pastDrawings],
  });

  const newPointsToVictory = utils.getPointsToVictory(newPlayers, ARTE_RUIM_GOAL);

  await sessionRef.doc('state').set({
    phase: PHASES.ARTE_RUIM.GALLERY,
    updatedAt: Date.now(),
    gallery,
    ranking,
    cards: store.currentCards,
    pointsToVictory: newPointsToVictory,
    round: state?.round ?? 0,
  });

  // Unready players and return
  await sessionRef.doc('players').set(newPlayers);

  return true;
};

const prepareGameOverPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  players: Players
) => {
  const winners = utils.determineWinners(players);

  await sessionRef.doc('state').set({
    phase: PHASES.ARTE_RUIM.GAME_OVER,
    winners,
    gameEndedAt: Date.now(),
    drawings: store.pastDrawings.sort((a, b) => (a.successRate < b.successRate ? 1 : -1)),
  });

  await sessionRef.doc('meta').update({
    isComplete: true,
  });

  return true;
};

export const nextArteRuimPhase = async (
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
  const store = storeDoc.data() ?? {};

  // Perform setup and reset any previous session stuff
  if (state?.phase === 'RULES') {
    await sessionRef.doc('store').update({
      currentCards: [],
    });
  }

  // Calculate points to victory
  const pointsToVictory = utils.getPointsToVictory(players, ARTE_RUIM_GOAL);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, pointsToVictory);

  // RULES -> DRAW
  if (nextPhase === PHASES.ARTE_RUIM.DRAW) {
    return prepareDrawPhase(sessionRef, store, state, players, pointsToVictory);
  }

  // DRAW -> EVALUATION
  if (nextPhase === PHASES.ARTE_RUIM.EVALUATION) {
    return prepareEvaluationPhase(sessionRef, store, state, players, pointsToVictory);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === PHASES.ARTE_RUIM.GALLERY) {
    return prepareGalleryPhase(sessionRef, store, state, players);
  }

  if (nextPhase === PHASES.ARTE_RUIM.GAME_OVER) {
    return prepareGameOverPhase(sessionRef, store, players);
  }

  return true;
};

export const submitDrawing = async (data: SubmitDrawingPayload) => {
  const { gameId, gameName: collectionName, playerId, drawing, cardId } = data;

  const actionText = 'submit your drawing';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(drawing, 'drawing', actionText);
  utils.verifyPayload(cardId, 'cardId', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].currentCard.drawing = drawing;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextArteRuimPhase(collectionName, gameId, players);
};

export const submitVoting = async (data: SubmitVotesPayload) => {
  const { gameId, gameName: collectionName, playerId, votes } = data;

  const actionText = 'submit your votes';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(votes, 'votes', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].votes = votes;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextArteRuimPhase(collectionName, gameId, players);
};

export const goToNextPhase = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'go to new round';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  return nextArteRuimPhase(collectionName, gameId, players);
};
