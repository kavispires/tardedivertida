import {
  GAME_COLLECTIONS,
  PHASES,
  AVATAR_IDS,
  ARTE_RUIM_GOAL,
  ARTE_RUIM_CARDS_BY_LEVEL,
} from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import {
  ArteRuimInitialState,
  Players,
  Player,
  ArteRuimState,
  BasicGamePayload,
  PlainObject,
  GameId,
  PlayerName,
  MakeMeReadyPayload,
  SubmitDrawingPayload,
  SubmitVotingPayload,
  FirebaseContext,
} from '../utils/interfaces';
// Resources
import { allCardsBR } from '../resources/arte-ruim-cards.js';

export const arteRuim = {
  /**
   * Get initial session
   * @param gameId
   * @param uid
   * @returns
   */
  getInitialSession: (gameId: GameId, uid: string, language: string): ArteRuimInitialState => ({
    meta: {
      gameId,
      gameName: GAME_COLLECTIONS.ARTE_RUIM,
      createdAt: Date.now(),
      createdBy: uid,
      min: 3,
      max: 8,
      isLocked: false,
      isComplete: false,
      language,
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
  }),
  /**
   * Creates new player object
   * @param name
   * @param players
   * @returns
   */
  createPlayer: (name: PlayerName, avatarId: string, players: Players = {}): Player => {
    const playerList = Object.values(players);
    const usedAvatars = playerList.map((player) => player.avatarId);
    avatarId = usedAvatars.includes(avatarId)
      ? gameUtils.getRandomUniqueItem(AVATAR_IDS, usedAvatars)
      : avatarId;

    return {
      name,
      avatarId,
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    };
  },
  /**
   * Locks game adding isLock to meta and moving to the RULES phase
   * @param players
   * @returns
   */
  lockGame: (): ArteRuimState => {
    return {
      phase: PHASES.ARTE_RUIM.RULES,
      round: 0,
    };
  },
};

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
  const playersNames = Object.keys(players);
  const newUsedCards: string[] = [];
  const currentCards = cards.map((cardId, index) => {
    const currentPlayer = playersNames?.[index] ?? null;

    const card = allCardsBR[cardId];
    const newCard = {
      id: cardId,
      level: card.level,
      text: card.text,
      playerName: currentPlayer,
      drawing: null,
      successRate: 0,
    };

    if (currentPlayer) {
      newPlayers[currentPlayer].currentCard = newCard;
      delete newPlayers[currentPlayer].votes;
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
    const artist = drawingEntry.playerName;

    const newGalleryEntry = {
      id: drawingEntry.id,
      drawing: drawingEntry.drawing,
      artist: drawingEntry.playerName,
      level: drawingEntry.level,
      text: drawingEntry.text,
      playersSay: {},
      playersPoints: {},
    };

    const playersSay = {};
    const playersPoints = {};

    Object.entries(<PlainObject>players).forEach(([pName, pObject]) => {
      if (artist === pName) return;

      // Calculate what players say
      const currentVote = pObject.votes[correctAnswer];
      if (playersSay[currentVote] === undefined) {
        playersSay[currentVote] = [];
      }
      playersSay[currentVote].push(pName);
      // Calculate player points
      if (playersPoints[pName] === undefined) {
        playersPoints[pName] = 0;
      }
      if (playersPoints[artist] === undefined) {
        playersPoints[artist] = 0;
      }

      if (currentVote === correctAnswer) {
        playersPoints[pName] += 2;
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
    newScores[player.name] = [player.score, 0, player.score];
  });

  gallery.forEach((window) => {
    Object.entries(window.playersPoints).forEach(([pName, value]) => {
      const points = Number(value ?? 0);
      newScores[pName][1] += points;
      newScores[pName][2] += points;

      newPlayers[pName].score += points;
    });
  });

  const ranking = Object.entries(newScores)
    .map(([pName, scores]) => {
      return {
        playerName: pName,
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

    card.successRate = Math.round(correctAnswers / numPlayers);
    return card;
  });

  // clear store
  await sessionRef.doc('store').update({
    pastDrawings,
    currentCards: [],
  });

  const newPointsToVictory = utils.getPointsToVictory(newPlayers, ARTE_RUIM_GOAL);

  await sessionRef.doc('state').set({
    phase: PHASES.ARTE_RUIM.GALLERY,
    gallery,
    ranking,
    pointsToVictory: newPointsToVictory,
    round: state?.round ?? 0,
  });

  // Unready players and return
  await sessionRef.doc('players').set(newPlayers);

  return true;
};

const prepareGameOverPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  players: Players
) => {
  const winner = Object.values(players).reduce(
    (result, player) => {
      if (player.store > result.score) {
        result = {
          name: player.name,
          avatarId: player.avatarId,
          score: player.score,
        };
      }

      return result;
    },
    {
      name: '',
      avatarId: '',
      score: 0,
    }
  );

  await sessionRef.doc('state').set({
    phase: PHASES.ARTE_RUIM.GAME_OVER,
    winner,
    gameEndedAt: Date.now(),
  });

  await sessionRef.doc('meta').update({
    isComplete: true,
  });

  return true;
};

const nextArteRuimPhase = async (
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
    return prepareGameOverPhase(sessionRef, players);
  }

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
  return nextArteRuimPhase(collectionName, gameId, players);
};

export const submitDrawing = async (data: SubmitDrawingPayload) => {
  const { gameId, gameName: collectionName, playerName, drawing, cardId } = data;

  const actionText = 'submit your drawing';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(drawing, 'drawing', actionText);
  utils.verifyPayload(cardId, 'cardId', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerName);
  updatedPlayers[playerName].currentCard.drawing = drawing;

  try {
    await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextArteRuimPhase(collectionName, gameId, players);
};

export const submitVoting = async (data: SubmitVotingPayload) => {
  const { gameId, gameName: collectionName, playerName, votes } = data;

  const actionText = 'submit your votes';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(votes, 'votes', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerName);
  updatedPlayers[playerName].votes = votes;

  try {
    await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
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
