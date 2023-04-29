// Constants
import { GAME_NAMES } from '../../utils/constants';
import { INSTRUMENTOS_CODIFICADOS_PHASES, PLAYER_COUNTS, TOTAL_ROUNDS } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  InstrumentosCodificadosInitialState,
  InstrumentosCodificadosSubmitAction,
} from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  prepareGameOverPhase,
  prepareSetupPhase,
  prepareHintGivingPhase,
  prepareHintReceivingPhase,
  prepareGuessTheCodePhase,
} from './setup';
import { getThemes } from './data';
import { determineNextPhase } from './helpers';
import { handleSubmitCode, handleSubmitConclusions, handleSubmitHint } from './actions';

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
): InstrumentosCodificadosInitialState => {
  return utils.helpers.getDefaultInitialState<InstrumentosCodificadosInitialState>({
    gameId,
    gameName: GAME_NAMES.INSTRUMENTOS_CODIFICADOS,
    uid,
    language,
    playerCounts: PLAYER_COUNTS,
    initialPhase: INSTRUMENTOS_CODIFICADOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {},
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

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round);

  // RULES -> SETUP
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.SETUP) {
    // Enter setup phase before doing anything
    await utils.firebase.triggerSetupPhase(sessionRef);

    // Request data
    const additionalData = await getThemes(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await utils.firebase.saveGame(sessionRef, newPhase);

    return getNextPhase(gameName, gameId);
  }

  // * -> HINT_GIVING
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.HINT_GIVING) {
    const newPhase = await prepareHintGivingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // HINT_GIVING -> HINT_RECEIVING
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.HINT_RECEIVING) {
    const newPhase = await prepareHintReceivingPhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // HINT_RECEIVING -> GUESS_THE_CODE
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.GUESS_THE_CODE) {
    const newPhase = await prepareGuessTheCodePhase(store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  // GUESS_THE_CODE --> GAME_OVER
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(gameId, store, state, players);
    return utils.firebase.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submit by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: InstrumentosCodificadosSubmitAction) => {
  const { gameId, gameName, playerId, action } = data;

  utils.firebase.validateSubmitActionPayload(gameId, gameName, playerId, action);

  switch (action) {
    case 'SUBMIT_HINT':
      if (!data.hint) {
        utils.firebase.throwException('Missing `hint` value', 'submit hint');
      }
      if (!data.targetId) {
        utils.firebase.throwException('Missing `targetId` value', 'submit targetId');
      }
      if (!data.position) {
        utils.firebase.throwException('Missing `position` value', 'submit position');
      }
      return handleSubmitHint(gameName, gameId, playerId, data.hint, data.targetId, data.position);
    case 'SUBMIT_CONCLUSIONS':
      if (!data.conclusions) {
        utils.firebase.throwException('Missing `conclusions` value', 'submit conclusions');
      }
      return handleSubmitConclusions(gameName, gameId, playerId, data.conclusions);
    case 'SUBMIT_CODE':
      if (!data.code) {
        utils.firebase.throwException('Missing `code` value', 'submit code');
      }
      return handleSubmitCode(gameName, gameId, playerId, data.code);
    default:
      utils.firebase.throwException(`Given action ${action} is not allowed`);
  }
};
