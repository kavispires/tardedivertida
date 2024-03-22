// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  PLAYER_COUNTS,
  MAX_ROUNDS,
  TEORIA_DE_CONJUNTOS_PHASES,
  TEORIA_DE_CONJUNTOS_ACTIONS,
} from './constants';
// Types
import type {
  TeoriaDeConjuntosInitialState,
  TeoriaDeConjuntosOptions,
  TeoriaDeConjuntosSubmitAction,
  FirebaseStateData,
  FirebaseStoreData,
} from './types';
// Utils
import utils from '../../utils';
// Internal Functions
import { determineNextPhase, determineOutcome } from './helpers';
import { handleSubmitEvaluation, handleSubmitItemDiagram, handleSubmitJudge } from './actions';
import { prepareSetupPhase, prepareGameOverPhase, prepareJudgeSelectionPhase } from './setup';
import { getResourceData } from './data';

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
  version: string,
  options: TeoriaDeConjuntosOptions
): TeoriaDeConjuntosInitialState => {
  return utils.helpers.getDefaultInitialState<TeoriaDeConjuntosInitialState>({
    gameId,
    gameName: GAME_NAMES.TEORIA_DE_CONJUNTOS,
    uid,
    language,
    version,
    playerCounts: PLAYER_COUNTS,
    initialPhase: TEORIA_DE_CONJUNTOS_PHASES.LOBBY,
    totalRounds: MAX_ROUNDS,
    store: {},
    options,
  });
};

/**
 * Exposes min and max player count
 */
export const playerCounts = PLAYER_COUNTS;

export const getNextPhase = async (
  gameName: string,
  gameId: string,
  currentState?: FirebaseStateData
): Promise<boolean> => {
  const { sessionRef, state, store, players } = await utils.firebase.getStateAndStoreReferences<
    FirebaseStateData,
    FirebaseStoreData
  >(gameName, gameId, 'prepare next phase', currentState);

  const currentGuess = determineOutcome(state.currentGuess, players?.[state?.activePlayerId]);

  // Determine next phase
  const nextPhase = determineNextPhase(state.phase, state.round, currentGuess);

  // RULES -> SETUP
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getResourceData(
      store.language,
      utils.players.getPlayerCount(players),
      store.options
    );

    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);
    return getNextPhase(gameName, gameId);
  }

  // SETUP -> JUDGE_SELECTION
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.JUDGE_SELECTION) {
    const newPhase = await prepareJudgeSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // * -> DIAGRAM_PLACEMENT
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.DIAGRAM_PLACEMENT) {
    const newPhase = await prepareJudgeSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // DIAGRAM_PLACEMENT -> EVALUATION
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.EVALUATION) {
    const newPhase = await prepareJudgeSelectionPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // EVALUATION --> GAME_OVER
  if (nextPhase === TEORIA_DE_CONJUNTOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submitted by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: TeoriaDeConjuntosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_JUDGE:
      utils.firebase.validateSubmitActionProperties(data, ['judgeId'], 'submit pairs');
      return handleSubmitJudge(gameName, gameId, playerId, data.judgeId);
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_ITEM_DIAGRAM:
      utils.firebase.validateSubmitActionProperties(
        data,
        ['itemId', 'diagramPosition'],
        'submit item diagram'
      );
      return handleSubmitItemDiagram(gameName, gameId, playerId, data.itemId, data.diagramPosition);
    case TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_EVALUATION:
      utils.firebase.validateSubmitActionProperties(data, ['evaluation'], 'submit evaluation');
      return handleSubmitEvaluation(gameName, gameId, playerId, data.evaluation);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
