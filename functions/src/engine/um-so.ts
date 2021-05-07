import { GAME_COLLECTIONS, AVATAR_IDS, UM_SO_PHASES, UM_SO_WORDS } from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import {
  Players,
  Player,
  ArteRuimState,
  GameId,
  PlayerName,
  UmSoInitialState,
  MakeMeReadyPayload,
  SubmitVotingPayload,
} from '../utils/interfaces';

export const umSo = {
  /**
   * Get initial session
   * @param gameId
   * @param uid
   * @returns
   */
  getInitialSession: (gameId: GameId, uid: string): UmSoInitialState => ({
    meta: {
      gameId,
      gameName: GAME_COLLECTIONS.UM_SO,
      createdAt: Date.now(),
      createdBy: uid,
      min: 3,
      max: 8,
      isLocked: false,
      isComplete: false,
    },
    players: {},
    store: {
      turnOrder: [],
      usedWords: {},
      currentWords: [],
      currentSuggestions: [],
    },
    state: {
      phase: UM_SO_PHASES.LOBBY,
      round: 0,
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
      phase: UM_SO_PHASES.RULES,
      round: 0,
    };
  },
};

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param pointsToVictory
 * @returns
 */
const determineNextPhase = (currentPhase: string, roundsToEndGame: number): string => {
  const { RULES, WORD_SELECTION, SUGGEST, COMPARE, GUESS, GAME_OVER } = UM_SO_PHASES;
  const order = [RULES, WORD_SELECTION, SUGGEST, COMPARE, GUESS, GAME_OVER];

  if (currentPhase === GUESS) {
    return roundsToEndGame <= 0 ? GAME_OVER : WORD_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return WORD_SELECTION;
};

const nextUmSoPhase = async (collectionName: string, gameId: string, players: Players): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Determine and prepare next phase
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const stateDoc = await utils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = storeDoc.data() ?? {};

  // Perform setup
  if (state?.phase === 'RULES') {
    // Determine player order
    const playersNames = gameUtils.shuffle(Object.keys(players));
    store.turnOrder = playersNames.length <= 6 ? [...playersNames, ...playersNames] : playersNames;
  }

  // // Calculate remaining rounds to end game
  const roundsToEndGame = utils.getRoundsToEndGame(state.round, store.turnOrder.length);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, roundsToEndGame);

  // * -> DRAW
  if (nextPhase === UM_SO_PHASES.WORD_SELECTION) {
    return prepareWordSelectionPhase(sessionRef, store, state, players, roundsToEndGame);
  }

  // WORD_SELECTION -> SUGGEST
  if (nextPhase === UM_SO_PHASES.SUGGEST) {
    return prepareSuggestPhase(sessionRef, store, state, players, roundsToEndGame);
  }

  // // EVALUATION -> GALLERY
  // if (nextPhase === ARTE_RUIM_PHASES.GALLERY) {
  //   return prepareGalleryPhase(sessionRef, store, state, players);
  // }

  // if (nextPhase === ARTE_RUIM_PHASES.GAME_OVER) {
  //   return prepareGameOverPhase(sessionRef, players);
  // }

  return true;
};

const prepareWordSelectionPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  roundsToEndGame: number
) => {
  const newRound = state.round + 1;
  // Determine guesser based on round and turnOrder
  const guesser = store.turnOrder[newRound - 1];

  // Get 5 random words
  const allWords = UM_SO_WORDS;
  const usedWords = Object.keys(store?.usedWords);
  const words = gameUtils.getRandomUniqueItems(allWords, usedWords, 5);

  const newWords = words.reduce((wordObjects, word) => {
    wordObjects[word] = {
      id: word,
      votes: 0,
    };

    return wordObjects;
  }, {});

  // Save used cards to store
  await sessionRef.doc('store').update({
    currentWords: newWords,
  });

  // Save new state
  await sessionRef.doc('state').set({
    phase: UM_SO_PHASES.WORD_SELECTION,
    round: newRound,
    guesser,
    nextGuesser: store.turnOrder?.[newRound],
    roundsToEndGame,
    words: Object.keys(newWords),
  });
  // Unready players and return
  await sessionRef.doc('players').set(utils.unReadyPlayers(players, guesser));

  return true;
};

const prepareSuggestPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  roundsToEndGame: number
) => {
  // Gather all words and pick the winner, in case of a tie, among all ties
  let mostVotes: any = [];
  const zeroVotes: any[] = [];
  Object.values(store.currentWords).forEach((wordObject: any) => {
    if (wordObject.votes === 0) {
      zeroVotes.push(wordObject);
      return;
    }

    if (mostVotes[0]?.votes ?? 1 === wordObject.votes) {
      mostVotes.push(wordObject);
      return;
    }

    if (mostVotes[0]?.votes ?? 1 < wordObject.votes) {
      mostVotes = [wordObject];
      return;
    }
  });

  const secretWord = gameUtils.shuffle(mostVotes)[0];

  // Save word as secretWord + any word that didn't receive any votes
  const newUsedWords = [...zeroVotes, secretWord].reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  // Save used words to store
  await sessionRef.doc('store').update({
    usedWords: {
      ...store.usedWords,
      ...newUsedWords,
    },
    currentWord: secretWord,
  });

  // Save new state
  await sessionRef.doc('state').set({
    phase: UM_SO_PHASES.SUGGEST,
    round: state.round,
    guesser: state.guesser,
    nextGuesser: state.nextGuesser,
    roundsToEndGame,
    secretWord: secretWord.id,
  });
  // Unready players and return
  await sessionRef.doc('players').set(utils.unReadyPlayers(players, state.guesser));

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
  return nextUmSoPhase(collectionName, gameId, players);
};

export const submitWordSelectionVotes = async (data: SubmitVotingPayload) => {
  const { gameId, gameName: collectionName, playerName, votes } = data;

  const actionText = 'submit your drawing';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(votes, 'votes', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  // Submit votes
  const store: any = storeDoc.data();
  try {
    const currentWords = { ...store.currentWords };

    votes.forEach((wordId: string) => {
      currentWords[wordId].votes += 1;
    });

    await sessionRef.doc('store').update({ currentWords });
  } catch (error) {
    utils.throwException(error, actionText);
  }

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
  return nextUmSoPhase(collectionName, gameId, players);
};
