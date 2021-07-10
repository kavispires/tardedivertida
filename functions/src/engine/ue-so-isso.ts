import { GAME_COLLECTIONS, GAME_PLAYERS_LIMIT, PHASES } from '../utils/constants';
import * as gameUtils from '../utils/game-utils';
import * as utils from '../utils/index';
import {
  Players,
  Player,
  GameId,
  UeSoIssoInitialState,
  SubmitVotesPayload,
  SubmitSuggestionsPayload,
  CurrentSuggestions,
  SubmitSuggestionsValidationPayload,
  ConfirmGuessPayload,
} from '../utils/interfaces';
// Resources
import { allWordsBR } from '../resources/ue-so-isso-words';

/**
 * Get Initial Game State
 * @param gameId
 * @param uid
 * @param language
 * @returns
 */
export const getInitialState = (gameId: GameId, uid: string, language: string): UeSoIssoInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.UE_SO_ISSO,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.UE_SO_ISSO.min,
    max: GAME_PLAYERS_LIMIT.UE_SO_ISSO.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    turnOrder: [],
    usedWords: {},
    currentWords: [],
    currentSuggestions: [],
  },
  state: {
    phase: PHASES.UE_SO_ISSO.LOBBY,
    round: 0,
  },
});

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param roundsToEndGame
 * @returns
 */
const determineNextPhase = (currentPhase: string, roundsToEndGame: number): string => {
  const { RULES, WORD_SELECTION, SUGGEST, COMPARE, GUESS, GAME_OVER } = PHASES.UE_SO_ISSO;
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

/**
 * Determine the number of suggestions based on the number of Players
 * @param players
 * @returns
 */
const determineSuggestionsNumber = (players: Players) => {
  const numberOfPlayers = Object.keys(players).length;

  if (numberOfPlayers <= 3) return 3;
  if (numberOfPlayers <= 4) return 2;
  return 1;
};

/**
 * Determine score based on the guess value
 * @param guess
 * @returns
 */
const determineScore = (guess: string): number => {
  if (guess === 'CORRECT') return 3;
  if (guess === 'WRONG') return -1;
  return 0;
};

/**
 * Determine the group current score
 * @param players
 * @param totalRounds
 * @returns
 */
const determineGroupScore = (players: Players, totalRounds: number): number => {
  const expectedPoints = totalRounds * 3;
  const totalPoints = Object.values(players).reduce((acc: number, player: Player) => {
    acc += player.score;
    return acc;
  }, 0);

  return Math.round((100 * totalPoints) / expectedPoints);
};

export const nextUeSoIssoPhase = async (
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

  // Perform setup and reset any previous session stuff
  if (state?.phase === 'RULES') {
    // Determine player order
    const playersNames = gameUtils.shuffle(Object.keys(players));
    store.turnOrder = playersNames.length <= 6 ? [...playersNames, ...playersNames] : playersNames;
    await sessionRef.doc('store').update({
      turnOrder: store.turnOrder,
      currentWord: utils.deleteValue(),
      currentWords: {},
      guess: utils.deleteValue(),
      validSuggestions: {},
    });
  }

  // Calculate remaining rounds to end game
  const roundsToEndGame = utils.getRoundsToEndGame(state.round, store.turnOrder.length);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, roundsToEndGame);

  // * -> DRAW
  if (nextPhase === PHASES.UE_SO_ISSO.WORD_SELECTION) {
    return prepareWordSelectionPhase(sessionRef, store, state, players, roundsToEndGame);
  }

  // WORD_SELECTION -> SUGGEST
  if (nextPhase === PHASES.UE_SO_ISSO.SUGGEST) {
    return prepareSuggestPhase(sessionRef, store, state, players, roundsToEndGame);
  }

  // SUGGEST -> COMPARE
  if (nextPhase === PHASES.UE_SO_ISSO.COMPARE) {
    return prepareComparePhase(sessionRef, store, state, players, roundsToEndGame);
  }

  // COMPARE -> GUESS
  if (nextPhase === PHASES.UE_SO_ISSO.GUESS) {
    return prepareGuessPhase(sessionRef, store, state, roundsToEndGame);
  }

  // GUESS -> GAME_OVER
  if (nextPhase === PHASES.UE_SO_ISSO.GAME_OVER) {
    return prepareGameOverPhase(sessionRef, store, state, players);
  }

  return true;
};

const prepareWordSelectionPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  roundsToEndGame: number
) => {
  // Count points if any:
  if (state.guesser && store.guess) {
    players[state.guesser].score += determineScore(store.guess);
    state.guesser = null;
    store.guess = null;
  }

  const newRound = state.round + 1;
  // Determine guesser based on round and turnOrder
  const guesser = store.turnOrder[newRound - 1];

  // Get 5 random words
  const allWordsIds = Object.keys(allWordsBR);
  const usedWords = Object.keys(store?.usedWords);
  const words = gameUtils.getRandomUniqueItems(allWordsIds, usedWords, 5);

  const newWords = words.reduce((wordObjects, wordId) => {
    wordObjects[wordId] = {
      id: wordId,
      text: allWordsBR[wordId],
      votes: 0,
    };

    return wordObjects;
  }, {});

  // Save used cards to store
  await sessionRef.doc('store').update({
    currentWords: newWords,
    turnOrder: store.turnOrder,
    currentSuggestions: {},
    validSuggestions: [],
    guess: null,
  });

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.UE_SO_ISSO.WORD_SELECTION,
    updatedAt: Date.now(),
    groupScore: determineGroupScore(players, store.turnOrder.length),
    round: newRound,
    guesser,
    nextGuesser: store.turnOrder?.[newRound] ?? store.turnOrder?.[0],
    roundsToEndGame,
    words: Object.values(newWords),
    previousSecretWord: state?.secretWord ?? '',
  });
  // Unready players and remove any previously used game keys
  const unReadiedPlayers = utils.unReadyPlayers(players, guesser);
  const removedPropsPlayers = utils.removePropertiesFromPlayers(unReadiedPlayers, ['suggestions', 'votes']);
  await sessionRef.doc('players').set(removedPropsPlayers);

  return true;
};

const prepareSuggestPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  roundsToEndGame: number
) => {
  const currentWords = { ...store.currentWords };
  Object.values(players).forEach((player) => {
    if (player?.votes) {
      player.votes.forEach((wordId: string) => {
        currentWords[wordId].votes += 1;
      });
    }
  });

  // Gather all words and pick the winner, in case of a tie, among all ties
  let mostVotes: any = [];
  const zeroVotes: any[] = [];
  Object.values(currentWords).forEach((wordObject: any) => {
    if (wordObject.votes === 0) {
      zeroVotes.push(wordObject);
      return;
    }

    const votesFromMost = mostVotes?.[0]?.votes ?? 1;

    if (votesFromMost < wordObject.votes) {
      mostVotes = [wordObject];
      return;
    }

    if (votesFromMost === wordObject.votes) {
      mostVotes.push(wordObject);
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
    phase: PHASES.UE_SO_ISSO.SUGGEST,
    updatedAt: Date.now(),
    groupScore: state.groupScore,
    round: state.round,
    guesser: state.guesser,
    nextGuesser: state.nextGuesser,
    roundsToEndGame,
    secretWord: secretWord,
    suggestionsNumber: determineSuggestionsNumber(players),
  });
  // Unready players and return
  await sessionRef.doc('players').set(utils.unReadyPlayers(players, state.guesser));

  return true;
};

const prepareComparePhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  roundsToEndGame: number
) => {
  const currentSuggestions: CurrentSuggestions = {};
  Object.values(players).forEach((player) => {
    if (player.suggestions) {
      player.suggestions.forEach((suggestion: string) => {
        if (currentSuggestions[suggestion] === undefined) {
          currentSuggestions[suggestion] = [];
        }
        currentSuggestions[suggestion].push(player.name);
      });
    }
  });

  // Gather all words and pick the winner, in case of a tie, among all ties
  const suggestionsArray = Object.entries(<CurrentSuggestions>currentSuggestions).reduce(
    (acc: any, suggestionEntry) => {
      const [suggestion, playersSug] = suggestionEntry;

      if (playersSug.length > 1) {
        const res = playersSug.map((pName) => {
          return {
            suggestion,
            playerName: pName,
            invalid: true,
          };
        });

        return [...acc, ...res];
      }

      acc.push({
        suggestion,
        playerName: playersSug[0],
        invalid: false,
      });

      return acc;
    },
    []
  );

  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.UE_SO_ISSO.COMPARE,
    updatedAt: Date.now(),
    groupScore: state.groupScore,
    round: state.round,
    guesser: state.guesser,
    nextGuesser: state.nextGuesser,
    roundsToEndGame,
    secretWord: state.secretWord,
    suggestions: gameUtils.shuffle(suggestionsArray),
  });

  return true;
};

const prepareGuessPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  roundsToEndGame: number
) => {
  // Save new state
  await sessionRef.doc('state').set({
    phase: PHASES.UE_SO_ISSO.GUESS,
    updatedAt: Date.now(),
    round: state.round,
    groupScore: state.groupScore,
    guesser: state.guesser,
    nextGuesser: state.nextGuesser,
    roundsToEndGame,
    secretWord: state.secretWord,
    validSuggestions: store.validSuggestions,
  });

  return true;
};

const prepareGameOverPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Count points if any:
  if (state.guesser && store.guess) {
    players[state.guesser].score += determineScore(store.guess);
    state.guesser = null;
    store.guess = null;
  }

  const groupScore = determineGroupScore(players, store.turnOrder.length);

  await sessionRef.doc('state').set({
    phase: PHASES.UE_SO_ISSO.GAME_OVER,
    round: state.round,
    group: {
      score: groupScore,
      victory: groupScore > 70,
    },
    gameEndedAt: Date.now(),
  });

  await sessionRef.doc('meta').update({
    isComplete: true,
  });

  return true;
};

export const submitWordSelectionVotes = async (data: SubmitVotesPayload) => {
  const { gameId, gameName: collectionName, playerId, votes } = data;

  const actionText = 'submit your word selection votes';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(votes, 'votes', actionText);

  // Get 'players' from given game session
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
  return nextUeSoIssoPhase(collectionName, gameId, players);
};

export const submitSuggestions = async (data: SubmitSuggestionsPayload) => {
  const { gameId, gameName: collectionName, playerId, suggestions } = data;

  const actionText = 'submit your suggestions';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(suggestions, 'suggestions', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].suggestions = suggestions;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }
  // If all players are ready, trigger next phase
  return nextUeSoIssoPhase(collectionName, gameId, players);
};

export const submitValidation = async (data: SubmitSuggestionsValidationPayload) => {
  const { gameId, gameName: collectionName, playerId, validSuggestions } = data;

  const actionText = 'submit the suggestions validation';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(validSuggestions, 'validSuggestions', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ validSuggestions });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextUeSoIssoPhase(collectionName, gameId, players);
};

export const sendGuess = async (data: ConfirmGuessPayload) => {
  const { gameId, gameName: collectionName, playerId, guess } = data;

  const actionText = 'submit the guess';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(guess, 'guess', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);

  // Submit suggestions
  try {
    await sessionRef.doc('state').update({ guess });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  return true;
};

export const confirmGuess = async (data: ConfirmGuessPayload) => {
  const { gameId, gameName: collectionName, playerId, guess } = data;

  const actionText = 'submit the guess';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerId, 'playerId', actionText);
  utils.verifyPayload(guess, 'guess', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Submit suggestions
  try {
    await sessionRef.doc('store').update({ guess });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextUeSoIssoPhase(collectionName, gameId, players);
};
