// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { VENDAVAL_DE_PALPITE_PHASES, PLAYER_COUNTS, MAX_ROUNDS } from './constants';
// Types
import type { VendavalDePalpiteInitialState, VendavalDePalpiteSubmitAction } from './types';
// Utils
import * as utils from '../../utils';
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
  language: Language
): VendavalDePalpiteInitialState => {
  return utils.helpers.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.VENDAVAL_DE_PALPITE,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: VENDAVAL_DE_PALPITE_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {
      language,
    },
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await utils.firebase.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round, state?.outcome, state?.lastRound);

  // RULES -> SETUP
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getData(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(collectionName, gameId, players);
  }

  // SETUP -> BOSS_SELECTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.BOSS_SELECTION) {
    const newPhase = await prepareBossPlayerSelection();
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // BOSS_SELECTION -> SECRET_WORD_SELECTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION) {
    const newPhase = await prepareSecretWordSelection(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> CARD_PLAY
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES) {
    const newPhase = await preparePlayersClues(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // CARD_PLAY -> RESOLUTION
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS) {
    const newPhase = await prepareClueEvaluations(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // RESOLUTION -> GAME_OVER
  if (nextPhase === VENDAVAL_DE_PALPITE_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Handles cards submissions
 * May trigger next phase
 */
export const submitAction = async (data: VendavalDePalpiteSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_BOSS':
      utils.firebase.validateSubmitActionProperties(data, ['bossId'], 'submit boss player id');
      return handleSubmitBossPlayer(collectionName, gameId, playerId, data.bossId);
    case 'SUBMIT_SECRET_WORD':
      utils.firebase.validateSubmitActionProperties(
        data,
        ['secretWord', 'categories'],
        'submit secret word and categories'
      );
      return handleSubmitSecretWord(collectionName, gameId, playerId, data.secretWord, data.categories);
    case 'SUBMIT_CLUES':
      utils.firebase.validateSubmitActionProperties(data, ['clues'], 'submit clues');
      return handleSubmitPlayerClues(collectionName, gameId, playerId, data.clues, data.guesses);
    case 'SUBMIT_EVALUATION':
      utils.firebase.validateSubmitActionProperties(data, ['evaluation'], 'submit evaluation');
      return handleSubmitEvaluation(collectionName, gameId, playerId, data.evaluation);
    case 'SUBMIT_OUTCOME':
      utils.firebase.validateSubmitActionProperties(data, ['outcome'], 'submit outcome');
      return handleSubmitOutcome(collectionName, gameId, playerId, data.outcome);
    case 'SUBMIT_HELP':
      utils.firebase.validateSubmitActionProperties(data, ['clueId'], 'submit help');
      return handleSubmitHelp(collectionName, gameId, playerId, data.clueId);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
