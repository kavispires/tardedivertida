// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  VENDAVAL_DE_PALPITE_PHASES,
  PLAYER_COUNTS,
  MAX_ROUNDS,
  VENDAVAL_DE_PALPITE_ACTIONS,
} from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  VendavalDePalpiteInitialState,
  VendavalDePalpiteSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
import { determineNextPhase } from './helpers';
// Internal Functions
import {
  prepareClueEvaluations,
  prepareGameOverPhase,
  prepareBossPlayerSelection,
  preparePlayersClues,
  prepareSecretWordSelection,
  prepareSetupPhase,
} from './setup';
import {
  handleSubmitEvaluation,
  handleSubmitHelp,
  handleSubmitBossPlayer,
  handleSubmitOutcome,
  handleSubmitPlayerClues,
  handleSubmitSecretWord,
} from './actions';
import { getData } from './data';

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
  version: string
): VendavalDePalpiteInitialState => {
  return utils.helpers.getDefaultInitialState<VendavalDePalpiteInitialState>({
    gameId,
    gameName: GAME_NAMES.VENDAVAL_DE_PALPITE,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: VENDAVAL_DE_PALPITE_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
  });
};

/**
 * Exposes min and max player count
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firestore.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.outcome);

  // RULES -> SETUP
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firestore.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firestore.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> BOSS_SELECTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.BOSS_SELECTION) {
    const newPhase = await prepareBossPlayerSelection();
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // BOSS_SELECTION -> SECRET_WORD_SELECTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION) {
    const newPhase = await prepareSecretWordSelection(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // * -> CARD_PLAY
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES) {
    const newPhase = await preparePlayersClues(store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> RESOLUTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS) {
    const newPhase = await prepareClueEvaluations(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firestore.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles cards submissions
 * May trigger next phase
 */
export const submitAction = async (data: VendavalDePalpiteSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_BOSS:
      utils.firebase.validateSubmitActionProperties(data, ['bossId'], 'submit boss player id');
      return handleSubmitBossPlayer(gameName, gameId, playerId, data.bossId);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_SECRET_WORD:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['secretWord', 'categories'],
        'submit secret word and categories'
      );
      return handleSubmitSecretWord(gameName, gameId, playerId, data.secretWord, data.categories);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_CLUES:
      utils.firebase.validateSubmitActionProperties(data, ['clues'], 'submit clues');
      return handleSubmitPlayerClues(gameName, gameId, playerId, data.clues, data.guesses);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_EVALUATION:
      utils.firebase.validateSubmitActionProperties(data, ['evaluation'], 'submit evaluation');
      return handleSubmitEvaluation(gameName, gameId, playerId, data.evaluation);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_OUTCOME:
      utils.firebase.validateSubmitActionProperties(data, ['outcome'], 'submit outcome');
      return handleSubmitOutcome(gameName, gameId, playerId, data.outcome);
    case VENDAVAL_DE_PALPITE_ACTIONS.SUBMIT_HELP:
      utils.firebase.validateSubmitActionProperties(data, ['clueId'], 'submit help');
      return handleSubmitHelp(gameName, gameId, playerId, data.clueId);
    default:
      utils.firebase.throwExceptionV2(`Given action ${action} is not allowed`, action);
  }
};
