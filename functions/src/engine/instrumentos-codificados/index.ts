// Constants
import { GAME_COLLECTIONS } from '../../utils/constants';
import { INSTRUMENTOS_CODIFICADOS_PHASES, PLAYER_COUNT, TOTAL_ROUNDS } from './constants';
// Interfaces
import { GameId, Language, Players } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { InstrumentosCodificadosInitialState, InstrumentosCodificadosSubmitAction } from './interfaces';
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
  return utils.getDefaultInitialState({
    gameId,
    gameName: GAME_COLLECTIONS.INSTRUMENTOS_CODIFICADOS,
    uid,
    language,
    playerCount: PLAYER_COUNT,
    initialPhase: INSTRUMENTOS_CODIFICADOS_PHASES.LOBBY,
    totalRounds: TOTAL_ROUNDS,
    store: {
      language,
    },
  });
};

export const nextInstrumentosCodificadosPhase = async (
  collectionName: string,
  gameId: string,
  players: Players
): Promise<boolean> => {
  const actionText = 'prepare next phase';

  // Gather docs and references
  const { sessionRef, state, store } = await firebaseUtils.getStateAndStoreReferences(
    collectionName,
    gameId,
    actionText
  );

  // Determine next phase
  const nextPhase = determineNextPhase(state?.phase, state?.round?.current);

  // RULES -> SETUP
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.SETUP) {
    // Request data
    const additionalData = await getThemes(store.language);
    const newPhase = await prepareSetupPhase(store, state, players, additionalData);
    await firebaseUtils.saveGame(sessionRef, newPhase);

    const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
    const newPlayers = playersDoc.data() ?? {};
    return nextInstrumentosCodificadosPhase(collectionName, gameId, newPlayers);
  }

  // * -> HINT_GIVING
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.HINT_GIVING) {
    const newPhase = await prepareHintGivingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // HINT_GIVING -> HINT_RECEIVING
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.HINT_RECEIVING) {
    const newPhase = await prepareHintReceivingPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // HINT_RECEIVING -> GUESS_THE_CODE
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.GUESS_THE_CODE) {
    const newPhase = await prepareGuessTheCodePhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  // GUESS_THE_CODE --> GAME_OVER
  if (nextPhase === INSTRUMENTOS_CODIFICADOS_PHASES.GAME_OVER) {
    const newPhase = await prepareGameOverPhase(store, state, players);
    return firebaseUtils.saveGame(sessionRef, newPhase);
  }

  return true;
};

/**
 * Perform action submit by the app
 * @param data
 * @returns
 */
export const submitAction = async (data: InstrumentosCodificadosSubmitAction) => {
  const { gameId, gameName: collectionName, playerId, action } = data;

  firebaseUtils.validateSubmitActionPayload(gameId, collectionName, playerId, action);

  switch (action) {
    case 'SUBMIT_HINT':
      if (!data.hint) {
        firebaseUtils.throwException('Missing `hint` value', 'submit hint');
      }
      if (!data.targetId) {
        firebaseUtils.throwException('Missing `targetId` value', 'submit targetId');
      }
      if (!data.position) {
        firebaseUtils.throwException('Missing `position` value', 'submit position');
      }
      return handleSubmitHint(collectionName, gameId, playerId, data.hint, data.targetId, data.position);
    case 'SUBMIT_CONCLUSIONS':
      if (!data.conclusions) {
        firebaseUtils.throwException('Missing `conclusions` value', 'submit conclusions');
      }
      return handleSubmitConclusions(collectionName, gameId, playerId, data.conclusions);
    case 'SUBMIT_CODE':
      if (!data.code) {
        firebaseUtils.throwException('Missing `code` value', 'submit code');
      }
      return handleSubmitCode(collectionName, gameId, playerId, data.code);
    default:
      firebaseUtils.throwException(`Given action ${action} is not allowed`);
  }
};
