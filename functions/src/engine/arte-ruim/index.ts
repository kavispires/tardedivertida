// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ARTE_RUIM_PHASES, PLAYER_COUNTS, MAX_ROUNDS, ARTE_RUIM_ACTIONS } from './constants';
// Types
import type {
  ArteRuimGameOptions,
  ArteRuimInitialState,
  ArteRuimSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utilities
import utils from '../../utils';
// Internal Functions
import { determineGameOver, determineNextPhase } from './helpers';
import {
  prepareSetupPhase,
  prepareDrawPhase,
  prepareEvaluationPhase,
  prepareGalleryPhase,
  prepareGameOverPhase,
} from './setup';
import { getCards, saveUsedCards } from './data';
import { handleSubmitDrawing, handleSubmitVoting } from './actions';

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
  language: Language,
  options: ArteRuimGameOptions
): ArteRuimInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_NAMES.ARTE_RUIM,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: ARTE_RUIM_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      deck: [],
      usedCards: [],
      currentCards: [],
      pastDrawings: [],
    },
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

/**
 *
 * @param gameName
 * @param gameId
 * @param players
 * @returns
 */
export const getNextPhase = async (
  gameName: GameName,
  gameId: GameId,
  players: Players
): Promise<boolean> => {
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase');

  // Determine if it's game over
  const isGameOver = determineGameOver(players, state?.round);
  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, isGameOver, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === ARTE_RUIM_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const data = await getCards(
      store.language,
      utils.players.getPlayerCount(players),
      store.options?.shortGame ?? false,
      store.options?.useAllCards ?? false
    );
    const newPhase = await prepareSetupPhase(store, state, players, data);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId, players);
  }

  // SETUP -> DRAW
  if (nextPhase === ARTE_RUIM_PHASES.DRAW) {
    const newPhase = await prepareDrawPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DRAW -> EVALUATION
  if (nextPhase === ARTE_RUIM_PHASES.EVALUATION) {
    const newPhase = await prepareEvaluationPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // EVALUATION -> GALLERY
  if (nextPhase === ARTE_RUIM_PHASES.GALLERY) {
    const newPhase = await prepareGalleryPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GALLERY -> GAME_OVER
  if (nextPhase === ARTE_RUIM_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    await saveUsedCards(store.pastDrawings, store.language);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: ArteRuimSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case ARTE_RUIM_ACTIONS.SUBMIT_DRAWING:
      utils.firebase.validateSubmitActionProperties(data, ['drawing'], 'submit drawing');
      return handleSubmitDrawing(gameName, gameId, playerId, data.drawing);
    case ARTE_RUIM_ACTIONS.SUBMIT_VOTING:
      utils.firebase.validateSubmitActionProperties(data, ['votes'], 'submit votes');
      return handleSubmitVoting(gameName, gameId, playerId, data.votes);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
