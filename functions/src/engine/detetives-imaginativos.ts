import {
  GAME_COLLECTIONS,
  PHASES,
  GAME_PLAYERS_LIMIT,
  CLUBE_DETETIVE_CONSTANTS as D_CONSTANTS,
} from '../utils/constants';
import * as firebaseUtils from '../utils/firebase';
import * as gameUtils from '../utils/game-utils';
import * as imageCards from '../utils/image-cards';
import * as utils from '../utils/helpers';
import {
  GameId,
  DetetivesImaginativosInitialState,
  Players,
  PlayerId,
  DetetivesImaginativosSubmitAction,
  GameName,
  Player,
  PlainObject,
} from '../utils/interfaces';

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
): DetetivesImaginativosInitialState => ({
  meta: {
    gameId,
    gameName: GAME_COLLECTIONS.CLUBE_DETETIVE,
    createdAt: Date.now(),
    createdBy: uid,
    min: GAME_PLAYERS_LIMIT.CLUBE_DETETIVE.min,
    max: GAME_PLAYERS_LIMIT.CLUBE_DETETIVE.max,
    isLocked: false,
    isComplete: false,
    language,
    replay: 0,
  },
  players: {},
  store: {
    usedCards: [],
    gameOrder: [],
  },
  state: {
    phase: PHASES.DETETIVES_IMAGINATIVOS.LOBBY,
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
  const { RULES, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER } = PHASES.DETETIVES_IMAGINATIVOS;
  const order = [RULES, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return roundsToEndGame <= 0 ? GAME_OVER : SECRET_CLUE;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return SECRET_CLUE;
};

/**
 * Deal cards to players from their own deck
 * @param players players object
 * @param quantity number of cards to be dealt
 * @param [playerId] if present, only this player will get cards
 * @returns
 */
const dealPlayersCard = (players: Players, quantity?: number, playerId?: PlayerId) => {
  const toPlayers = playerId ? [playerId] : Object.keys(players);

  toPlayers.forEach((playerId) => {
    const player = players[playerId];
    const currentHand = player?.hand ?? [];
    const handLimit = quantity ? currentHand.length + quantity : D_CONSTANTS.HAND_LIMIT;
    let currentDeckIndex = player?.deckIndex ?? -1;
    for (let i = currentHand.length; i < handLimit; i++) {
      currentHand.push(player.deck[currentDeckIndex + 1]);
      currentDeckIndex++;
    }

    player.hand = currentHand;
    player.deckIndex = currentDeckIndex;
  });

  return players;
};

/**
 * Deal cards to players from their own deck
 * @param players players object
 * @param quantity number of cards to be dealt
 * @param [playerId] if present, only this player will get cards
 * @returns
 */
const discardPlayerCard = (players: Players, cardId: string, playerId: PlayerId) => {
  const player = players[playerId];
  const currentHand = gameUtils.removeItem(player?.hand ?? [], cardId);

  let currentDeckIndex = player?.deckIndex ?? -1;
  for (let i = currentHand.length; i < D_CONSTANTS.HAND_LIMIT; i++) {
    const deck = player.deck;
    currentHand.push(deck[currentDeckIndex + 1]);
    currentDeckIndex++;
  }

  player.hand = currentHand;
  player.deckIndex = currentDeckIndex;

  return players;
};

const determinePhaseOrder = (
  leader: PlayerId,
  gameOrder: PlayerId[],
  players: Players,
  repeat?: boolean
): PlayerId[] => {
  const result: PlayerId[] = [];
  const playerIds = Object.values(players);
  const tempGameOrder = [...gameOrder, ...gameOrder];
  const leaderIndex = tempGameOrder.indexOf(leader);

  for (let i = 0; i < playerIds.length; i++) {
    result.push(tempGameOrder[leaderIndex + i]);
  }

  return repeat ? [...result, ...result] : result;
};

export const nextDetetivesImaginativosPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Determine and prepare next phase
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'store', actionText);

  const state = stateDoc.data() ?? {};
  const store = { ...(storeDoc.data() ?? {}) };

  // Perform setup and reset any previous session stuff
  if (state?.phase === 'RULES') {
    // Determine player order
    const playerIds = gameUtils.shuffle(Object.keys(players));
    store.gameOrder = playerIds.length < 6 ? [...playerIds, ...playerIds] : playerIds;

    await sessionRef.doc('store').update({
      gameOrder: store.gameOrder,
      usedCards: [],
    });

    // Assigned cards to players depending on player count
    // We build the used cards deck all at once to avoid having to generate and
    // get unique ones every time
    const cardsPerPlayer = D_CONSTANTS.CARDS_PER_PLAYER[playerIds.length];
    const minNumCards = playerIds.length * cardsPerPlayer;
    const numDecks = Math.ceil(minNumCards / imageCards.IMAGE_CARDS_PER_DECK);
    const cards = gameUtils.shuffle(imageCards.getImageCards(numDecks));

    // Split cards equally between players
    players = gameUtils.dealList(cards, players, cardsPerPlayer, 'deck');
  }

  // Calculate remaining rounds to end game
  const roundsToEndGame = utils.getRoundsToEndGame(state.round + 1, store.gameOrder.length);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, roundsToEndGame);

  // * -> SECRET_CLUE
  if (nextPhase === PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE) {
    return prepareSecretCluePhase(sessionRef, store, state, players, roundsToEndGame);
  }

  // SECRET_CLUE -> CARD_PLAY
  if (nextPhase === PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY) {
    return prepareCardPlayPhase(sessionRef, store, state, players);
  }

  // CARD_PLAY -> DEFENSE
  if (nextPhase === PHASES.DETETIVES_IMAGINATIVOS.DEFENSE) {
    return prepareDefensePhase(sessionRef, store, state, players);
  }

  // DEFENSE -> VOTING
  if (nextPhase === PHASES.DETETIVES_IMAGINATIVOS.VOTING) {
    return prepareVotingPhase(sessionRef, store, state, players);
  }

  // VOTING -> REVEAL
  if (nextPhase === PHASES.DETETIVES_IMAGINATIVOS.REVEAL) {
    return prepareRevealPhase(sessionRef, store, state, players);
  }

  // REVEAL --> GAME_OVER
  if (nextPhase === PHASES.DETETIVES_IMAGINATIVOS.GAME_OVER) {
    return prepareGameOverPhase(sessionRef, players);
  }

  return true;
};

const prepareSecretCluePhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players,
  roundsToEndGame: number
) => {
  const newRound = state.round + 1;

  // Make sure everybody has 6 cards in hand
  players = dealPlayersCard(players);
  players = utils.removePropertiesFromPlayers(players, ['vote']);

  // Determine the leader
  const leader = store.gameOrder[newRound - 1];
  // Determine the impostor
  const impostor = gameUtils.shuffle(Object.keys(players).filter((playerId) => playerId !== leader))[0];

  // Update players
  await sessionRef.doc('players').update(players);

  // Update players
  await sessionRef.doc('state').set({
    phase: PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE,
    updatedAt: Date.now(),
    round: newRound,
    roundsToEndGame,
    leader,
    impostor,
  });

  return true;
};

const prepareCardPlayPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Build phase order (from leader forward once)
  const phaseOrder = determinePhaseOrder(state.leader, store.gameOrder, players, true);

  // Update state
  await sessionRef.doc('state').update({
    phase: PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY,
    updatedAt: Date.now(),
    clue: store.clue,
    phaseOrder,
    phaseIndex: 0,
    currentPlayerId: phaseOrder[0],
    table: [],
  });

  return true;
};

const prepareDefensePhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Build phase order (from leader forward once)
  const phaseOrder = determinePhaseOrder(state.leader, store.gameOrder, players);

  // Update state
  await sessionRef.doc('state').update({
    phase: PHASES.DETETIVES_IMAGINATIVOS.DEFENSE,
    updatedAt: Date.now(),
    phaseOrder,
    phaseIndex: 0,
    currentPlayerId: phaseOrder[0],
  });

  return true;
};

const prepareVotingPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Unready players
  const newPlayers = utils.unReadyPlayers(players, state.leader);

  // Update players
  await sessionRef.doc('players').update(newPlayers);

  // Update state
  await sessionRef.doc('state').update({
    phase: PHASES.DETETIVES_IMAGINATIVOS.VOTING,
    updatedAt: Date.now(),
  });

  return true;
};

export const countImpostorVotes = (players: Players, impostor: PlayerId): number =>
  Object.values(players).reduce((total: number, player: Player) => {
    if (player.vote === impostor) {
      total += 1;
    }

    return total;
  }, 0);

export const calculateNewScores = (
  players: Players,
  impostorVotes: number,
  impostor: PlayerId,
  leader: PlayerId
): PlainObject => {
  const relevantPlayers = [impostor, leader];

  return Object.values(players).reduce((result, player) => {
    const currentScore = player.score;
    let addedScore = 0;
    // If detectives won
    if (impostorVotes > 1 && !relevantPlayers.includes(player.id)) {
      // If the player voted for the impostor
      if (player.vote === impostor) {
        addedScore += 3;
      }
    }
    // If relevant players won
    if (impostorVotes <= 1) {
      if (impostor === player.id) {
        addedScore += 5;
      }
      if (leader === player.id) {
        addedScore += 4;
      }
    }

    const newScore = currentScore + addedScore;
    result[player.id] = [currentScore, addedScore, newScore];
    // Update player as well
    player.score = newScore;
    return result;
  }, {});
};

const prepareRevealPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  store: FirebaseFirestore.DocumentData,
  state: FirebaseFirestore.DocumentData,
  players: Players
) => {
  // Check how many votes impostor got
  const impostorVotes = countImpostorVotes(players, state.impostor);

  // -- Ranking Stuff Start
  // Format <playerId>: [<old score>, <addition points>, <new score>]
  const newScores = calculateNewScores(players, impostorVotes, state.impostor, state.leader);

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

  // Update player scores
  await sessionRef.doc('players').update(players);

  // Update state
  await sessionRef.doc('state').update({
    phase: PHASES.DETETIVES_IMAGINATIVOS.REVEAL,
    updatedAt: Date.now(),
    ranking,
    impostorVotes,
  });

  return true;
};

const prepareGameOverPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  players: Players
) => {
  const winners = utils.determineWinners(players);

  // Update state
  await sessionRef.doc('state').set({
    phase: PHASES.DETETIVES_IMAGINATIVOS.GAME_OVER,
    gameEndedAt: Date.now(),
    winners,
  });

  await sessionRef.doc('meta').update({
    isComplete: true,
  });

  return true;
};

// Submit Actions helpers

const handleSubmitClue = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string
) => {
  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', 'submit clue');

  // Submit clue
  try {
    await sessionRef.doc('store').update({ clue });
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to save clue to store');
  }

  const players = playersDoc.data() ?? {};

  // If all players are ready, trigger next phase
  return nextDetetivesImaginativosPhase(collectionName, gameId, players);
};

const handlePlayCard = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string
) => {
  const actionText = 'play a card';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  if (state.currentPlayerId !== playerId) {
    firebaseUtils.throwException('You are not the current player!', 'Failed to play card.');
  }

  // Remove card from player's hand and add new card
  try {
    const newPlayers = discardPlayerCard(players, cardId, playerId);
    await sessionRef.doc('players').update(newPlayers);
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to update player with new card');
  }

  // Add card to table
  try {
    const table = state?.table ?? [];
    const playerTableIndex = table.findIndex((i) => i.playerId === playerId);
    if (playerTableIndex === -1) {
      state.table.push({
        playerId,
        cards: [cardId, ''],
      });
    } else {
      state.table[playerTableIndex].cards[1] = cardId;
    }

    const newPhaseIndex = state.phaseIndex + 1;

    // If it is the last player to play, go to the next phase
    if (newPhaseIndex === state.phaseOrder.length) {
      await sessionRef.doc('state').update({ table });
      nextDetetivesImaginativosPhase(collectionName, gameId, players);
    } else {
      await sessionRef.doc('state').update({
        table,
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.phaseOrder[newPhaseIndex],
      });
    }
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to update table with new card');
  }

  return true;
};

const handleDefend = async (collectionName: GameName, gameId: GameId, playerId: PlayerId) => {
  const actionText = 'defend';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);

  const state = stateDoc.data() ?? {};

  if (state.currentPlayerId !== playerId) {
    firebaseUtils.throwException('You are not the current player!', 'Failed to play card.');
  }

  // Add card to table
  try {
    const newPhaseIndex = state.phaseIndex + 1;

    // If it is the last player to play, go to the next phase
    if (newPhaseIndex === state.phaseOrder.length) {
      const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
      const players = playersDoc.data() ?? {};
      nextDetetivesImaginativosPhase(collectionName, gameId, players);
    } else {
      await sessionRef.doc('state').update({
        phaseIndex: newPhaseIndex,
        currentPlayerId: state.phaseOrder[newPhaseIndex],
      });
    }
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to conclude your defense');
  }

  return true;
};

const handleSubmitVote = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId
) => {
  const actionText = 'vote';
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach vote
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].vote = vote;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextDetetivesImaginativosPhase(collectionName, gameId, updatedPlayers);
};

// API caller

export const submitAction = async (data: DetetivesImaginativosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  const actionText = 'submit action';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(action, 'action', actionText);

  switch (action) {
    case 'SUBMIT_CLUE':
      if (!data.clue) {
        firebaseUtils.throwException('Missing `clue` value', 'submit clue');
      }
      return handleSubmitClue(collectionName, gameId, playerId, data.clue);
    case 'PLAY_CARD':
      if (!data.cardId) {
        firebaseUtils.throwException('Missing `cardId` value', 'play card');
      }
      return handlePlayCard(collectionName, gameId, playerId, data.cardId);
    case 'DEFEND':
      return handleDefend(collectionName, gameId, playerId);
    case 'SUBMIT_VOTE':
      if (!data.vote) {
        firebaseUtils.throwException('Missing `vote` value', 'submit vote');
      }
      return handleSubmitVote(collectionName, gameId, playerId, data.vote);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
