import {
  GAME_COLLECTIONS,
  ARTE_RUIM_PHASES,
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
  StatePlayers,
  PlainObject,
} from '../utils/interfaces';

export const arteRuim = {
  /**
   * Get initial session
   * @param gameId
   * @param uid
   * @returns
   */
  getInitialSession: (gameId: string, uid: string): ArteRuimInitialState => ({
    meta: {
      gameId,
      gameName: GAME_COLLECTIONS.ARTE_RUIM,
      createdAt: Date.now(),
      createdBy: uid,
      min: 3,
      max: 8,
      isLocked: false,
      isComplete: false,
    },
    players: {},
    store: {
      usedCards: [],
      previousDrawings: [],
      currentCards: [],
      currentDrawings: [],
      currentVoting: {},
    },
    state: {
      phase: ARTE_RUIM_PHASES.LOBBY,
      round: 0,
    },
  }),
  /**
   * Creates new player object
   * @param name
   * @param players
   * @returns
   */
  createPlayer: (name: string, avatarId: string, players: Players = {}): Player => {
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
      phase: ARTE_RUIM_PHASES.RULES,
      round: 0,
    };
  },
};

/**
 * Set given player as ready in the players object
 * @param players
 * @param playerName
 * @returns
 */
export const readyPlayer = (players: Players, playerName: string): Players => {
  players[playerName].ready = true;
  players[playerName].updatedAt = Date.now();
  return players;
};

/**
 * Set all players as not ready
 * @param players
 * @returns
 */
export const unReadyPlayers = (players: Players): Players => {
  for (const player in players) {
    players[player].ready = false;
  }
  return players;
};

/**
 * Verify if all players are ready
 * @param players
 * @returns
 */
export const isEverybodyReady = (players: Players): boolean => {
  return Object.values(players).every((player) => player.ready);
};

export const getPointsToVictory = (players: StatePlayers, victory = 30): number => {
  const max = Object.values(players).reduce((acc, player) => {
    return Math.max(acc, player.score);
  }, 0);

  return max < victory ? victory - max : 0;
};

const getLevel = (pointsToVictory: number, goal: number): number => {
  return pointsToVictory <= goal / 3 ? 3 : pointsToVictory <= (goal * 2) / 3 ? 2 : 1;
};

const getCardsForLevel = (level: number): string[] => {
  return ARTE_RUIM_CARDS_BY_LEVEL[level];
};

const determineNumberOfCards = (players: Players): number => {
  const playerCount = Object.keys(players).length;
  if (playerCount < 5) {
    return 7;
  }
  return playerCount + 2;
};

const determineNextPhase = (currentPhase: string, pointsToVictory: number): string => {
  const { RULES, DRAW, EVALUATION, GALLERY, GAME_OVER, RANKING } = ARTE_RUIM_PHASES;
  if (currentPhase === RULES) return DRAW;
  if (currentPhase === DRAW) return EVALUATION;
  if (currentPhase === EVALUATION) return GALLERY;
  if (currentPhase === GALLERY) return RANKING;
  if (currentPhase === RANKING) {
    if (pointsToVictory <= 0) return GAME_OVER;
    return DRAW;
  }
  console.warn('Missing phase check');
  return DRAW;
};

export const nextArteRuimPhase = async (
  collectionName: string,
  gameId: string,
  playerName: string,
  players: Players
): Promise<boolean> => {
  console.log(collectionName, gameId, playerName, players);

  const actionText = 'prepare next phase';

  // Determine and prepare next phase
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = storeDoc.data() ?? {};

  // Calculate points to victory
  const pointsToVictory = getPointsToVictory(players, ARTE_RUIM_GOAL);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, pointsToVictory);

  // RULES -> DRAW
  if (nextPhase === ARTE_RUIM_PHASES.DRAW) {
    const level = getLevel(pointsToVictory, ARTE_RUIM_GOAL);
    // Get random cards
    const numberOfCards = determineNumberOfCards(players);
    const allCards = getCardsForLevel(level);
    const usedCards = (store?.usedCards ?? []).map((usedCard) => usedCard.id);
    const cards = gameUtils.getRandomUniqueItems(allCards, usedCards, numberOfCards);
    // Assign one card per player
    const playersNames = Object.keys(players);
    const cardsState = {};
    const newUsedCards = cards.map((card, index) => {
      const currentPlayer = playersNames?.[index] ?? null;

      if (currentPlayer) {
        cardsState[currentPlayer] = card;
      }

      return {
        id: card,
        playerName: currentPlayer,
        // drawing: null,
        // upVotes: 0,
        // downVotes: 0,
      };
    });

    // Save used cards to store
    await sessionRef.doc('store').update({
      usedCards: [...usedCards, ...newUsedCards],
      currentCards: newUsedCards,
    });
    // Save new state
    await sessionRef.doc('state').set({
      phase: nextPhase,
      cards: cardsState,
      pointsToVictory,
      round: (state?.round ?? 0) + 1,
    });
    // Unready players and return
    await sessionRef.doc('players').set(unReadyPlayers(players));

    return true;
  }

  // DRAW -> EVALUATION
  if (nextPhase === ARTE_RUIM_PHASES.EVALUATION) {
    const shuffledCards = gameUtils.shuffle(store.currentCards);
    const shuffledDrawings = gameUtils.shuffle(store.currentDrawings);

    // Save new state
    await sessionRef.doc('state').set({
      phase: nextPhase,
      cards: shuffledCards,
      drawings: shuffledDrawings,
      pointsToVictory,
      round: state?.round ?? 0,
    });

    // Unready players and return
    await sessionRef.doc('players').set(unReadyPlayers(players));

    return true;
  }

  if (nextPhase === ARTE_RUIM_PHASES.GALLERY) {
    // Calculate everybody's points
    const gallery = store.currentDrawings.map((drawingEntry) => {
      const correctAnswer = `${drawingEntry.cardId}`;
      const artist = drawingEntry.playerName;

      const newEntry = {
        drawing: drawingEntry.drawing,
        artist,
        correctAnswer,
        playersSay: {},
        playersPoints: {},
      };

      const playersSay = {};
      const playersPoints = {};

      Object.entries(<PlainObject>store.currentVoting).forEach(([pName, votes]) => {
        if (artist !== pName) return;

        // Calculate what players say
        const currentVote = votes[correctAnswer];
        if (playersSay[currentVote] === undefined) {
          playersSay[currentVote] = [];
        }
        playersSay[currentVote].push(pName);
        // Calculate player points
        if (playersPoints[pName] === undefined) {
          playersPoints[pName] = 0;
        }
        if (playersPoints[pName] === undefined) {
          playersPoints[artist] = 0;
        }

        if (currentVote === correctAnswer) {
          playersPoints[pName] += 2;
          playersPoints[artist] += 1;
        }
      });
      newEntry.playersSay = playersSay;
      newEntry.playersPoints = playersPoints;
      return newEntry;
    });

    await sessionRef.doc('state').set({
      phase: nextPhase,
      gallery,
      pointsToVictory,
      round: state?.round ?? 0,
    });

    return true;
  }

  if (nextPhase === ARTE_RUIM_PHASES.RANKING) {
    // Loop state gallery and gather points
    const newPlayers = unReadyPlayers(players);

    // Format <player>: [<old score>, <addition points>, <new score>]
    const newScores: PlainObject = {};

    // Build score object
    Object.values(newPlayers).forEach((player) => {
      newScores[player.name] = [player.score, 0, 0];
    });

    state.gallery.forEach((window) => {
      Object.entries(window.playerPoints).forEach(([pName, value]) => {
        const points = Number(value ?? 0);
        newScores[pName][1] = points;
        newScores[pName][2] = newScores[pName][0] + points;

        newPlayers[pName].score += Number(points ?? 0);
      });
    });

    const ranking = Object.entries(newScores).map(([pName, scores]) => {
      return {
        playerName: pName,
        previousScore: scores[0],
        gainedPoints: scores[1],
        newScore: scores[2],
      };
    });

    // clear store
    await sessionRef.doc('store').update({
      previousDrawings: [...store.previousDrawings, ...store.currentDrawings],
      currentDrawings: [],
    });

    await sessionRef.doc('state').set({
      phase: nextPhase,
      pointsToVictory,
      ranking,
      round: state?.round ?? 0,
    });

    // Unready players and return
    await sessionRef.doc('players').set(newPlayers);

    return true;
  }

  if (nextPhase === ARTE_RUIM_PHASES.GAME_OVER) {
    await sessionRef.doc('state').set({
      phase: nextPhase,
    });

    await sessionRef.doc('meta').update({
      isComplete: true,
    });

    return true;
  }

  return true;
};
